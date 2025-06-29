import * as faceapi from 'face-api.js';

export interface FaceDetectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

class FaceDetectionService {
  private modelsLoaded = false;

  async loadModels() {
    if (this.modelsLoaded) return;

    try {
      // Load face detection models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      
      this.modelsLoaded = true;
      console.log('Face detection models loaded successfully');
    } catch (error) {
      console.error('Error loading face detection models:', error);
      throw new Error('Failed to load face detection models');
    }
  }

  async detectFaces(imageElement: HTMLImageElement): Promise<FaceDetectionBox[]> {
    if (!this.modelsLoaded) {
      await this.loadModels();
    }

    try {
      const detections = await faceapi
        .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      return detections.map((detection, index) => {
        const { box } = detection.detection;
        return {
          id: index + 1,
          x: box.x / imageElement.width,
          y: box.y / imageElement.height,
          width: box.width / imageElement.width,
          height: box.height / imageElement.height,
          confidence: detection.detection.score || 0.8,
        };
      });
    } catch (error) {
      console.error('Error detecting faces:', error);
      throw new Error('Failed to detect faces in image');
    }
  }

  async detectFacesFromFile(file: File): Promise<FaceDetectionBox[]> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const detections = await this.detectFaces(img);
          resolve(detections);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  async detectFacesFromUrl(url: string): Promise<FaceDetectionBox[]> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        try {
          const detections = await this.detectFaces(img);
          resolve(detections);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image from URL'));
      img.src = url;
    });
  }

  drawFaceBoxes(
    canvas: HTMLCanvasElement,
    imageElement: HTMLImageElement,
    faces: FaceDetectionBox[]
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match displayed image size
    const width = imageElement.clientWidth;
    const height = imageElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw face boxes
    faces.forEach((face) => {
      const x = face.x * width;
      const y = face.y * height;
      const w = face.width * width;
      const h = face.height * height;

      // Draw box
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      // Draw confidence score with background
      const confText = `${Math.round(face.confidence * 100)}%`;
      ctx.font = 'bold 14px Arial';
      ctx.textBaseline = 'top';
      const textWidth = ctx.measureText(confText).width;
      const textHeight = 18;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(x, y - textHeight, textWidth + 8, textHeight);
      ctx.fillStyle = '#ef4444';
      ctx.fillText(confText, x + 4, y - textHeight + 2);
    });
  }
}

export const faceDetectionService = new FaceDetectionService();
export default faceDetectionService; 