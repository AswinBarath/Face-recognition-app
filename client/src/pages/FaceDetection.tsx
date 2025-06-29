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
      // Set the image preview directly (let the browser handle CORS)
      setImagePreview(imageUrl);
      
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
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag & drop an image here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  browse files
                </button>
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, GIF, WebP (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleFileUpload}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Detect Faces
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {imagePreview && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Results</h3>
          <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
            <img
              ref={imageRef}
              src={imagePreview}
              alt="Uploaded image"
              className="max-w-full h-auto rounded-lg"
              onLoad={() => {
                if (imageRef.current && canvasRef.current && detectedFaces.length > 0) {
                  faceDetectionService.drawFaceBoxes(canvasRef.current, imageRef.current, detectedFaces);
                } else if (canvasRef.current) {
                  // Clear canvas if no faces
                  const ctx = canvasRef.current.getContext('2d');
                  if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }
              }}
              style={{ display: 'block' }}
            />
            <canvas
              ref={canvasRef}
              className="face-canvas"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                pointerEvents: 'none',
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '0.5rem',
              }}
            />
          </div>

          {detectedFaces.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Detected Faces: {detectedFaces.length}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {detectedFaces.map((face, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      Face #{face.id}
                    </p>
                    <p className="text-xs text-gray-600">
                      Confidence: {Math.round(face.confidence * 100)}%
                    </p>
                    <p className="text-xs text-gray-600">
                      Position: ({Math.round(face.x * 100)}%, {Math.round(face.y * 100)}%)
                    </p>
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