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
```

### 5. Start the Application

Start both the server and client development servers:

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

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

**Happy Face Detecting! 🎉** 