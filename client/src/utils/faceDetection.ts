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

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    // Draw face boxes
    faces.forEach((face) => {
      const x = face.x * canvas.width;
      const y = face.y * canvas.height;
      const width = face.width * canvas.width;
      const height = face.height * canvas.height;

      // Draw box
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Draw confidence score
      ctx.fillStyle = '#ef4444';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${Math.round(face.confidence * 100)}%`,
        x,
        y - 10
      );
    });
  }
}

export const faceDetectionService = new FaceDetectionService();
export default faceDetectionService; 