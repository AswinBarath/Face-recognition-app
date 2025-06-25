export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Face {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface FaceDetectionResult {
  success: boolean;
  faceCount: number;
  faces: Face[];
  processingTime: number;
  imageId: number;
  fileName?: string;
}

export interface ImageDetection {
  id: number;
  face_count: number;
  processing_time_ms: number;
  created_at: string;
  image_url?: string;
  file_name?: string;
  file_path?: string;
}

export interface DetectionHistory {
  detections: ImageDetection[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserStats {
  totalImages: number;
  totalDetections: number;
  totalFacesDetected: number;
  joinedDate: string | null;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
} 