import React, { useState, useRef, useCallback } from 'react';
import { Upload, Link as LinkIcon, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { faceAPI } from '../services/api';
import { User, Face, FaceDetectionResult } from '../types';
import faceDetectionService from '../utils/faceDetection';

interface FaceDetectionProps {
  user: User;
}

const FaceDetection: React.FC<FaceDetectionProps> = ({ user }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectedFaces, setDetectedFaces] = useState<Face[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const clearResults = () => {
    setDetectedFaces([]);
    setError('');
    setSuccess('');
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    setLoading(true);
    clearResults();

    try {
      // Use the proxy endpoint to avoid CORS issues
      const proxyUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faces/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      
      // First, try to load the image through the proxy to validate the URL
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image from URL'));
        img.src = proxyUrl;
      });

      setImagePreview(proxyUrl);
      
      // Call the API for face detection
      const result: FaceDetectionResult = await faceAPI.detectFromUrl(imageUrl);
      setDetectedFaces(result.faces);
      setSuccess(`Successfully detected ${result.faceCount} face(s) in ${result.processingTime}ms`);
      
      // Draw face boxes after image loads
      setTimeout(() => {
        if (imageRef.current && canvasRef.current) {
          faceDetectionService.drawFaceBoxes(canvasRef.current, imageRef.current, result.faces);
        }
      }, 100);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process image from URL');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setSelectedFile(file);
      setImageUrl('');
      clearResults();
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    clearResults();

    try {
      const result: FaceDetectionResult = await faceAPI.uploadImage(selectedFile);
      setDetectedFaces(result.faces);
      setSuccess(`Successfully detected ${result.faceCount} face(s) in ${result.processingTime}ms`);
      
      // Draw face boxes after image loads
      setTimeout(() => {
        if (imageRef.current && canvasRef.current) {
          faceDetectionService.drawFaceBoxes(canvasRef.current, imageRef.current, result.faces);
        }
      }, 100);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload and process image');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setImageUrl('');
        clearResults();
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please drop a valid image file');
      }
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Face Detection</h1>
        <p className="text-gray-600">
          Upload an image or enter an image URL to detect faces using AI
        </p>
      </div>

      {/* Input Methods */}
      <div className="card">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LinkIcon className="w-4 h-4 inline mr-2" />
            Image URL
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload File
          </button>
        </div>

        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="input flex-1"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary whitespace-nowrap"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Detect
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div
              className="upload-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {selectedFile ? selectedFile.name : 'Drop an image here or click to browse'}
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, GIF, and WebP formats
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {selectedFile && (
              <button
                onClick={handleFileUpload}
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Detect Faces
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Display and Results */}
      {imagePreview && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Results</h3>
          
          <div className="relative inline-block">
            <img
              ref={imageRef}
              src={imagePreview}
              alt="Uploaded"
              className="max-w-full h-auto rounded-lg"
              style={{ display: 'none' }}
              onLoad={() => {
                if (imageRef.current && canvasRef.current) {
                  canvasRef.current.width = imageRef.current.naturalWidth;
                  canvasRef.current.height = imageRef.current.naturalHeight;
                  const ctx = canvasRef.current.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(imageRef.current, 0, 0);
                  }
                }
              }}
            />
            <canvas
              ref={canvasRef}
              className="face-detection-canvas max-w-full h-auto"
            />
          </div>

          {detectedFaces.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Detected Faces: {detectedFaces.length}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {detectedFaces.map((face, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Face #{face.id}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round(face.confidence * 100)}% confidence
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>Position: ({Math.round(face.x * 100)}%, {Math.round(face.y * 100)}%)</p>
                      <p>Size: {Math.round(face.width * 100)}% × {Math.round(face.height * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceDetection;