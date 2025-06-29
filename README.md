# Face Recognition App

A full-stack face recognition application built with the PERN stack (PostgreSQL, Express.js, React.js, Node.js) that allows users to detect faces in images through URL input or file uploads.

## 🚀 Implemented Features

- 🔐 **User Authentication**: Secure JWT-based registration and login system
- 📸 **Image Input**: Support for both image URL input and file uploads
- 👥 **Face Detection**: AI-powered face detection with bounding box visualization
- 📊 **Statistics Dashboard**: Track total images, detections, and faces counted
- 📋 **Detection History**: View all previous face detection results
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- 🔒 **Security**: Rate limiting, CORS protection, and input validation

## 📋 Pending Functional Requirements

### 4. **Real Face Detection Integration**
- Replace simulated face detection with actual AI APIs
- Support for multiple face detection services:
  - **Clarifai**: Easy integration with good free tier
  - **AWS Rekognition**: Enterprise-grade detection
  - **Google Cloud Vision**: High accuracy detection
- Real-time face detection with confidence scores
- Support for multiple faces per image

### 5. **Enhanced UI/UX Improvements**
- Improved error handling and user feedback
- Loading states and progress indicators
- Mobile-responsive design optimization
- Image preview thumbnails in history
- Drag-and-drop file upload with visual feedback
- Real-time face detection visualization
- Accessibility improvements (ARIA labels, keyboard navigation)

### 6. **Comprehensive Testing Suite**
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Complete user workflow testing
- **Performance Tests**: Load testing for face detection API
- **Security Tests**: Authentication and authorization testing
- Test coverage reporting and monitoring

### 7. **Production Deployment Setup**
- **Environment Configuration**: Production environment variables
- **Process Management**: PM2 configuration for Node.js backend
- **Static File Serving**: Express static file serving for React build
- **Database Migration**: Production database setup and migration scripts
- **SSL/HTTPS**: Secure communication setup
- **Monitoring**: Health checks and logging

### 8. **Documentation & Maintenance**
- **API Documentation**: Complete endpoint documentation with examples
- **Code Documentation**: Inline code comments and JSDoc
- **User Guide**: Step-by-step user instructions
- **Developer Guide**: Setup and contribution guidelines
- **Deployment Guide**: Production deployment instructions
- **Troubleshooting Guide**: Common issues and solutions

### 9. **Advanced Features & Enhancements**
- **User Profile Management**: Profile editing and avatar upload
- **Multi-face Recognition**: Identify and label multiple faces
- **Face Comparison**: Compare faces across different images
- **Admin Dashboard**: User management and analytics
- **Image Gallery**: Organized image storage and management
- **Export Functionality**: Export detection results and statistics
- **Real-time Notifications**: WebSocket-based real-time updates
- **Advanced Analytics**: Detailed usage statistics and insights

## 🛠️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Face-api.js** for client-side face detection
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Sharp** for image processing
- **Helmet** for security headers

### Database
- **PostgreSQL** with comprehensive schema
- **User management** with authentication
- **Image storage** and metadata tracking
- **Face detection** history and statistics

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd face-recognition-app
```

### 2. Install Dependencies

Install all dependencies for the root, server, and client:

```bash
npm run install-all
```

Or install them individually:

```bash
# Root dependencies
npm install

# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

### 3. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL as superuser
psql -h localhost -U postgres

# Create the database
CREATE DATABASE face_recognition_db;

# Exit psql
\q
```

#### Run Database Schema

```bash
# Run the schema file
psql -h localhost -U postgres -d face_recognition_db -f database/schema.sql
```

### 4. Environment Configuration

Create the environment file for the server:

```bash
# Copy the example environment file
copy server\env.example server\.env
```

Edit `server/.env` with your database credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=face_recognition_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Face Detection API Configuration
# Get your free API key from: https://www.clarifai.com/
CLARIFAI_API_KEY=your_clarifai_api_key_here
```

### 5. Start the Application

Start both the server and client development servers:

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🧪 Local Testing Guide

### Prerequisites for Testing

1. **PostgreSQL Database**: Must be running and accessible
2. **Clarifai API Key**: Required for real face detection
3. **Node.js Environment**: All dependencies installed

### Step-by-Step Local Testing

#### 1. Database Setup

```bash
# Start PostgreSQL service (Windows)
net start postgresql-x64-15

# Or on macOS/Linux
sudo service postgresql start
# or
brew services start postgresql

# Create database
psql -h localhost -U postgres -c "CREATE DATABASE face_recognition_db;"

# Run schema
psql -h localhost -U postgres -d face_recognition_db -f database/schema.sql
```

#### 2. Environment Configuration

```bash
# Copy environment template
cp server/env.example server/.env

# Edit the .env file with your credentials
nano server/.env
```

**Required Environment Variables:**
```env
# Database (update with your PostgreSQL credentials)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=face_recognition_db
DB_USER=postgres
DB_PASSWORD=your_actual_password

# JWT (generate a secure random string)
JWT_SECRET=your_very_secure_jwt_secret_key_here_make_it_long_and_random

# Clarifai API (get from https://www.clarifai.com/)
CLARIFAI_API_KEY=your_actual_clarifai_api_key
```

#### 3. Install Dependencies

```bash
# Install all dependencies
npm run install-all

# Verify installations
npm list --depth=0
cd server && npm list --depth=0
cd ../client && npm list --depth=0
```

#### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

#### 5. Test Application Features

**A. User Registration & Login**
1. Open http://localhost:3000
2. Click "Create a new account"
3. Fill in username, email, and password
4. Verify registration success
5. Log out and log back in

**B. Face Detection Testing**
1. Navigate to "Face Detection" page
2. Test URL input:
   - Use: `https://samples.clarifai.com/metro-north.jpg`
   - Click "Detect"
   - Verify face detection results
3. Test file upload:
   - Upload a portrait image
   - Verify face detection with bounding boxes
   - Check processing time

**C. Dashboard & History**
1. Check dashboard statistics
2. View detection history
3. Verify pagination works

**D. API Endpoint Testing**

Test backend endpoints directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 6. Troubleshooting Common Issues

**Database Connection Issues:**
```bash
# Check PostgreSQL status
pg_ctl status -D /usr/local/var/postgres

# Test connection
psql -h localhost -U postgres -d face_recognition_db -c "SELECT version();"
```

**Port Conflicts:**
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process if needed
npx kill-port 5000 3000
```

**CORS Issues:**
- Verify CORS_ORIGIN in server/.env matches frontend URL
- Check browser console for CORS errors

**API Key Issues:**
- Verify Clarifai API key is correct
- Check API usage limits
- Test API key with curl:

```bash
curl -X POST https://api.clarifai.com/v2/models/face-detection/outputs \
  -H "Authorization: Key YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_app_id":{"user_id":"clarifai","app_id":"main"},"inputs":[{"data":{"image":{"url":"https://samples.clarifai.com/metro-north.jpg"}}}]}'
```

### Testing Checklist

- [ ] Database connection successful
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Servers start without errors
- [ ] User registration works
- [ ] User login works
- [ ] Face detection with URL works
- [ ] Face detection with file upload works
- [ ] Dashboard displays statistics
- [ ] History shows previous detections
- [ ] API endpoints respond correctly
- [ ] Error handling works properly

### Performance Testing

```bash
# Test API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/health

# Load test with Apache Bench
ab -n 100 -c 10 http://localhost:5000/api/health
```

## 📁 Project Structure

```
Face-recognition-app/
├── client/                     # React frontend
│   ├── public/                 # Static files
│   │   ├── components/         # React components
│   │   │   └── Navbar.tsx      # Navigation component
│   │   ├── pages/             # Page components
│   │   │   ├── Login.tsx       # Login page
│   │   │   ├── Register.tsx    # Registration page
│   │   │   ├── Dashboard.tsx   # User dashboard
│   │   │   ├── FaceDetection.tsx # Face detection page
│   │   │   └── History.tsx     # Detection history page
│   │   ├── services/          # API services
│   │   │   └── api.ts         # API communication
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts       # Type definitions
│   │   ├── utils/             # Utility functions
│   │   │   └── faceDetection.ts # Face detection utilities
│   │   ├── App.tsx            # Main app component
│   │   ├── App.css            # App styles
│   │   ├── index.tsx          # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Client dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── tsconfig.json          # TypeScript configuration
├── server/                     # Node.js backend
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── faces.js           # Face detection routes
│   ├── package.json           # Server dependencies
│   ├── server.js              # Express server
│   └── .env                   # Environment variables
├── database/
│   └── schema.sql             # Database schema
├── package.json               # Root package.json
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Face Detection
- `POST /api/faces/detect` - Detect faces in image URL
- `POST /api/faces/upload` - Upload image and detect faces
- `GET /api/faces/history` - Get user's detection history
- `GET /api/faces/stats` - Get user statistics

### Health Check
- `GET /api/health` - Server health status

## 🎯 Usage Guide

### 1. Registration & Login
1. Navigate to http://localhost:3000
2. Click "Create a new account" to register
3. Fill in username, email, and password
4. Login with your credentials

### 2. Face Detection
1. Go to the "Face Detection" page
2. Choose between URL input or file upload:
   - **URL Input**: Enter an image URL and click "Detect"
   - **File Upload**: Drag & drop or browse for an image file
3. View detected faces with bounding boxes
4. Check detection statistics

### 3. Dashboard & History
- **Dashboard**: View your overall statistics and quick actions
- **History**: Browse all previous face detections with details

## 🔧 Configuration

### Database Configuration
The application uses PostgreSQL with the following default settings:
- Host: localhost
- Port: 5432
- Database: face_recognition_db
- User: postgres

### File Upload Settings
- Maximum file size: 10MB
- Supported formats: JPG, PNG, GIF, WebP
- Upload directory: `./uploads`

### Security Settings
- JWT token expiration: 7 days
- Rate limiting: 100 requests per 15 minutes
- CORS origin: http://localhost:3000

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
error: database "face_recognition_db" does not exist
```
**Solution**: Create the database and run the schema
```bash
psql -h localhost -U postgres -c "CREATE DATABASE face_recognition_db;"
psql -h localhost -U postgres -d face_recognition_db -f database/schema.sql
```

#### 2. React Scripts Not Found
```
'react-scripts' is not recognized as an internal or external command
```
**Solution**: Install client dependencies
```bash
cd client && npm install
```

#### 3. PostgreSQL Authentication Failed
```
FATAL: password authentication failed for user "postgres"
```
**Solution**: 
- Set a password for the postgres user
- Update the DB_PASSWORD in server/.env
- Or use passwordless authentication

#### 4. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
- Kill the process using the port: `npx kill-port 5000`
- Or change the PORT in server/.env

#### 5. CORS Errors
```
Access to fetch at 'http://localhost:5000/api/auth/register' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Ensure CORS_ORIGIN is set correctly in server/.env

### Development Commands

```bash
# Start both servers
npm run dev

# Start only the server
npm run server

# Start only the client
npm run client

# Install all dependencies
npm run install-all

# Build for production
npm run build

# Run tests
npm test

# Setup database
npm run db:setup
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for development and production
- **Security Headers**: Helmet.js for additional security

## 🚀 Deployment

### Production Build

1. **Build the client**:
```bash
cd client && npm run build
```

2. **Set production environment variables**:
```env
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
DB_PASSWORD=your_production_db_password
```

3. **Start the production server**:
```bash
cd server && npm start
```

### Environment Variables for Production

```env
# Required for production
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret_here
DB_PASSWORD=your_production_database_password

# Optional configurations
PORT=5000
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=50
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Face-api.js](https://github.com/justadudewhohacks/face-api.js) for face detection capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful UI framework
- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [API Endpoints](#api-endpoints) documentation
3. Open an issue on GitHub with detailed error information

## 🔄 Version History

- **v1.0.0** - Initial release with basic face detection functionality
- User authentication system
- Image upload and URL input
- Face detection with bounding boxes
- Statistics dashboard
- Detection history

---

## 📊 **Project Status & Personal Notes**

### **Current Project Status**

Your face recognition app is **~85% complete** with a solid foundation. Here's what's working and what needs to be completed:

#### ✅ **What's Already Implemented:**

1. **Full Authentication System** - JWT-based login/register ✅
2. **Database Schema** - PostgreSQL with proper relationships ✅
3. **Backend API** - Complete REST API with security middleware ✅
4. **Frontend UI** - React with TypeScript and Tailwind CSS ✅
5. **File Upload System** - Image upload with validation ✅
6. **User Dashboard & History** - Statistics and detection history ✅
7. **Security Features** - Rate limiting, CORS, input validation ✅

### **🚀 Critical Steps to Complete the Project:**

#### **1. Get Real Face Detection Working (HIGH PRIORITY)**

**✅ Clarifai Integration (COMPLETED)**
- ✅ Created PAT from Clarifai
- ✅ Added API key to server/.env
- ✅ Integrated Clarifai face detection API
- ✅ Fallback to simulation if API fails

**Option B: AWS Rekognition (Alternative)**
1. AWS account with Rekognition access
2. Configure AWS credentials
3. Update the detection function

#### **2. Set Up Your Environment**

```bash
# 1. Install all dependencies
npm run install-all

# 2. Set up PostgreSQL database
# Create database: CREATE DATABASE face_recognition_db;
# Run schema: psql -d face_recognition_db -f database/schema.sql

# 3. Configure environment variables
# Copy server/env.example to server/.env and fill in your values

# 4. Start the application
npm run dev
```

#### **3. Required Environment Variables**

Create `server/.env` with:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=face_recognition_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_very_secure_secret_key_here

# Face Detection API Configuration
# Get your free API key from: https://www.clarifai.com/
CLARIFAI_API_KEY=your_clarifai_api_key_here 

# Other settings (can use defaults)
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### **🔧 Quick Start Commands:**

```bash
# Install everything
npm run install-all

# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Database setup (if you have PostgreSQL)
npm run db:setup
```

### **📋 Final Checklist:**

- [x] **Install dependencies**: `npm run install-all`
- [ ] **Set up PostgreSQL database**
- [x] **Get Clarifai API key** (COMPLETED)
- [ ] **Configure environment variables**
- [ ] **Test the application**: `npm run dev`
- [ ] **Verify face detection works**
- [ ] **Test all features**: registration, login, upload, detection, history

### **🎉 What You'll Have When Complete:**

1. **Full-stack face recognition app** with real AI detection
2. **User authentication system** with JWT
3. **Image upload and URL input** support
4. **Face detection with bounding boxes** visualization
5. **User dashboard** with statistics
6. **Detection history** with pagination
7. **Responsive UI** with modern design
8. **Production-ready** with security features

### **🚀 Next Steps After Basic Setup:**

1. **Add more AI services** (AWS Rekognition, Google Cloud Vision)
2. **Implement face recognition** (identify specific people)
3. **Add image optimization** and compression
4. **Implement real-time detection** with WebSockets
5. **Add admin dashboard** for user management
6. **Deploy to production** (Heroku, AWS, etc.)

### **💡 Pro Tips:**

1. **✅ Clarifai integration completed** - ready for testing
2. **Test with different image types** - portraits, group photos, etc.
3. **Monitor API usage** to stay within free tier limits
4. **Add error handling** for failed API calls
5. **Implement caching** for better performance

### **🔍 Clarifai Model Documentation**

[![face-detection](https://clarifai.com/api/clarifai/main/models/face-detection/badge)](https://clarifai.com/aswinbarath/Face-recognition-app?show_wizard_model_path_modal=true&onboardingModals=ONBOARDING_CHOOSE_COMMUNITY_MODEL_MODAL_ID&onboardingModals=COMMUNITY_MODEL_MODAL_ID&onboardingUserId=clarifai&onboardingAppId=main&onboardingModelId=face-detection)

**Face Detection Model Details:**
- **Purpose**: Detects faces and outputs bounding boxes
- **Architecture**: InceptionV2 with FPN (Feature Pyramid Networks)
- **Intended Use**: General purpose face detector
- **Limitations**: False positives with small objects, heavy occlusion affects performance
- **Training Data**: openimages_v4_face_only_crowd_filtered
- **Evaluation Results**:
  - AP50 for OpenImagesV4: 82.8
  - AP50 for WiderFace (easy): 85.2
  - AP50 for WiderFace (medium): 81.1
  - AP50 for WiderFace (hard): 61.6

**API Integration Status:**
- ✅ PAT (Personal Access Token) created
- ✅ API key added to environment variables
- ✅ Backend integration completed
- ✅ Fallback simulation implemented
- ⏳ Ready for local testing

Your app is very close to being complete! The main missing piece was the real face detection API integration, which is now implemented. Once you set up the database and environment, you'll have a fully functional face recognition application! 🎉

---

**Happy Face Detecting! 🎉**