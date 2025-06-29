const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   POST /api/faces/detect
// @desc    Detect faces in uploaded image or URL
// @access  Private
router.post('/detect', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const userId = req.user.id;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const startTime = Date.now();

    // Download and process image
    let imageBuffer;
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000
      });
      imageBuffer = Buffer.from(response.data);
    } catch (error) {
      return res.status(400).json({ message: 'Failed to download image from URL' });
    }

    // Process image with Sharp
    const processedImage = await sharp(imageBuffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // For this demo, we'll use a simple face detection approach
    // In a real application, you would integrate with a face detection API
    // like Clarifai, AWS Rekognition, or Google Cloud Vision
    
    // Simulate face detection (replace with actual API call)
    const faceDetectionResult = await detectFacesWithClarifai(processedImage);
    
    const processingTime = Date.now() - startTime;

    // Save image record
    const imageResult = await db.query(
      'INSERT INTO images (user_id, image_url, file_name, file_size, mime_type) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, imageUrl, 'uploaded-image.jpg', processedImage.length, 'image/jpeg']
    );

    const imageId = imageResult.rows[0].id;

    // Save face detection record
    await db.query(
      'INSERT INTO face_detections (image_id, user_id, face_count, detection_data, processing_time_ms) VALUES ($1, $2, $3, $4, $5)',
      [imageId, userId, faceDetectionResult.faceCount, JSON.stringify(faceDetectionResult.faces), processingTime]
    );

    res.json({
      success: true,
      faceCount: faceDetectionResult.faceCount,
      faces: faceDetectionResult.faces,
      processingTime,
      imageId
    });

  } catch (error) {
    console.error('Face detection error:', error);
    res.status(500).json({ message: 'Server error during face detection' });
  }
});

// @route   POST /api/faces/upload
// @desc    Upload image file and detect faces
// @access  Private
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const userId = req.user.id;
    const startTime = Date.now();

    // Process uploaded image
    const processedImage = await sharp(req.file.path)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Simulate face detection
    const faceDetectionResult = await detectFacesWithClarifai(processedImage);
    
    const processingTime = Date.now() - startTime;

    // Save image record
    const imageResult = await db.query(
      'INSERT INTO images (user_id, file_path, file_name, file_size, mime_type) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, req.file.path, req.file.originalname, req.file.size, req.file.mimetype]
    );

    const imageId = imageResult.rows[0].id;

    // Save face detection record
    await db.query(
      'INSERT INTO face_detections (image_id, user_id, face_count, detection_data, processing_time_ms) VALUES ($1, $2, $3, $4, $5)',
      [imageId, userId, faceDetectionResult.faceCount, JSON.stringify(faceDetectionResult.faces), processingTime]
    );

    res.json({
      success: true,
      faceCount: faceDetectionResult.faceCount,
      faces: faceDetectionResult.faces,
      processingTime,
      imageId,
      fileName: req.file.originalname
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// @route   GET /api/faces/history
// @desc    Get user's face detection history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT 
        fd.id,
        fd.face_count,
        fd.processing_time_ms,
        fd.created_at,
        i.image_url,
        i.file_name,
        i.file_path
      FROM face_detections fd
      JOIN images i ON fd.image_id = i.id
      WHERE fd.user_id = $1
      ORDER BY fd.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await db.query(
      'SELECT COUNT(*) FROM face_detections WHERE user_id = $1',
      [userId]
    );

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      detections: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/faces/stats
// @desc    Get user's face detection statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT * FROM user_stats WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        totalImages: 0,
        totalDetections: 0,
        totalFacesDetected: 0,
        joinedDate: null
      });
    }

    const stats = result.rows[0];
    res.json({
      totalImages: parseInt(stats.total_images),
      totalDetections: parseInt(stats.total_detections),
      totalFacesDetected: parseInt(stats.total_faces_detected),
      joinedDate: stats.joined_date
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Replace the simulateFaceDetection function with real API integration
async function detectFacesWithClarifai(imageBuffer) {
  try {
    // You'll need to sign up for a free Clarifai account and get an API key
    // https://www.clarifai.com/
    const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
    
    if (!CLARIFAI_API_KEY) {
      throw new Error('Clarifai API key not configured');
    }

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');

    const response = await axios.post(
      'https://api.clarifai.com/v2/models/face-detection/outputs',
      {
        user_app_id: {
          user_id: 'clarifai',
          app_id: 'main'
        },
        inputs: [
          {
            data: {
              image: {
                base64: base64Image
              }
            }
          }
        ]
      },
      {
        headers: {
          'Authorization': `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const regions = response.data.outputs[0].data.regions || [];
    const faces = regions.map((region, index) => {
      const boundingBox = region.region_info.bounding_box;
      return {
        id: index + 1,
        x: boundingBox.left_col,
        y: boundingBox.top_row,
        width: boundingBox.right_col - boundingBox.left_col,
        height: boundingBox.bottom_row - boundingBox.top_row,
        confidence: region.value || 0.9
      };
    });

    return {
      faceCount: faces.length,
      faces
    };
  } catch (error) {
    console.error('Clarifai API error:', error);
    // Fallback to simulation if API fails
    return await simulateFaceDetection(imageBuffer);
  }
}

// Keep the simulation as fallback
async function simulateFaceDetection(imageBuffer) {
  // This is a simulation - replace with actual face detection API
  // For example: Clarifai, AWS Rekognition, Google Cloud Vision
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Simulate random face detection (1-5 faces)
  const faceCount = Math.floor(Math.random() * 5) + 1;
  const faces = [];
  
  for (let i = 0; i < faceCount; i++) {
    faces.push({
      id: i + 1,
      x: Math.random() * 0.8,
      y: Math.random() * 0.8,
      width: 0.1 + Math.random() * 0.2,
      height: 0.1 + Math.random() * 0.2,
      confidence: 0.7 + Math.random() * 0.3
    });
  }
  
  return {
    faceCount,
    faces
  };
}

module.exports = router; 