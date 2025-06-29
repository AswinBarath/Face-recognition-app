# Local Testing Guide

This guide provides step-by-step instructions for testing the Face Recognition App locally.

## 🧪 Prerequisites for Testing

1. **PostgreSQL Database**: Must be running and accessible
2. **Clarifai API Key**: Required for real face detection
3. **Node.js Environment**: All dependencies installed
4. **Git Repository**: Project cloned locally

## 🚀 Step-by-Step Local Testing

### 1. Database Setup

#### Windows
```bash
# Start PostgreSQL service
net start postgresql-x64-15

# Or if using PostgreSQL installer
# Start from Services or use pgAdmin
```

#### macOS
```bash
# Using Homebrew
brew services start postgresql

# Or manually
pg_ctl -D /usr/local/var/postgres start
```

#### Linux
```bash
# Ubuntu/Debian
sudo service postgresql start

# Or
sudo systemctl start postgresql
```

#### Create Database
```bash
# Connect to PostgreSQL
psql -h localhost -U postgres

# Create database
CREATE DATABASE face_recognition_db;

# Exit psql
\q

# Run schema
psql -h localhost -U postgres -d face_recognition_db -f database/schema.sql
```

### 2. Environment Configuration

```bash
# Copy environment template
cp server/env.example server/.env

# Edit the .env file
nano server/.env
# or
code server/.env
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

# Other settings (can use defaults)
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Install Dependencies

```bash
# Install all dependencies
npm run install-all

# Verify installations
npm list --depth=0
cd server && npm list --depth=0
cd ../client && npm list --depth=0
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

### 5. Test Application Features

#### A. User Registration & Login
1. Open http://localhost:3000
2. Click "Create a new account"
3. Fill in username, email, and password
4. Verify registration success
5. Log out and log back in

#### B. Face Detection Testing
1. Navigate to "Face Detection" page
2. Test URL input:
   - Use: `https://samples.clarifai.com/metro-north.jpg`
   - Click "Detect"
   - Verify face detection results
3. Test file upload:
   - Upload a portrait image
   - Verify face detection with bounding boxes
   - Check processing time

#### C. Dashboard & History
1. Check dashboard statistics
2. View detection history
3. Verify pagination works

#### D. API Endpoint Testing

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

# Get user stats (requires auth token)
curl -X GET http://localhost:5000/api/faces/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Troubleshooting Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
pg_ctl status -D /usr/local/var/postgres

# Test connection
psql -h localhost -U postgres -d face_recognition_db -c "SELECT version();"

# Check if database exists
psql -h localhost -U postgres -l | grep face_recognition_db
```

#### Port Conflicts
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process if needed
npx kill-port 5000 3000

# Or change ports in .env
PORT=5001
```

#### CORS Issues
- Verify CORS_ORIGIN in server/.env matches frontend URL
- Check browser console for CORS errors
- Ensure both servers are running

#### API Key Issues
- Verify Clarifai API key is correct
- Check API usage limits
- Test API key with curl:

```bash
curl -X POST https://api.clarifai.com/v2/models/face-detection/outputs \
  -H "Authorization: Key YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_app_id":{"user_id":"clarifai","app_id":"main"},"inputs":[{"data":{"image":{"url":"https://samples.clarifai.com/metro-north.jpg"}}}]}'
```

#### React Scripts Not Found
```bash
# Reinstall client dependencies
cd client && rm -rf node_modules package-lock.json
npm install
```

#### PostgreSQL Authentication Failed
```bash
# Set password for postgres user
sudo -u postgres psql
ALTER USER postgres PASSWORD 'your_password';
\q

# Or use passwordless authentication
# Edit pg_hba.conf to use trust method
```

### 7. Testing Checklist

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
- [ ] File uploads work
- [ ] Image processing works
- [ ] Bounding boxes display correctly

### 8. Performance Testing

```bash
# Test API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/health

# Load test with Apache Bench
ab -n 100 -c 10 http://localhost:5000/api/health

# Memory usage check
npm run server &
ps aux | grep node
```

### 9. Browser Testing

#### Test in Different Browsers
- Chrome
- Firefox
- Safari
- Edge

#### Test Responsive Design
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

#### Test File Upload
- JPG images
- PNG images
- Large files (>5MB)
- Invalid file types

### 10. Error Scenarios

#### Test Error Handling
1. **Invalid API Key**: Remove or change Clarifai API key
2. **Database Down**: Stop PostgreSQL service
3. **Network Issues**: Disconnect internet
4. **Invalid File**: Upload non-image file
5. **Large File**: Upload file > 10MB
6. **Invalid URL**: Use non-existent image URL

#### Expected Behavior
- Graceful error messages
- Fallback to simulation when API fails
- Proper validation messages
- No crashes or infinite loading

### 11. Security Testing

#### Authentication
- Test without JWT token
- Test with expired token
- Test with invalid token
- Test registration with existing email

#### Input Validation
- SQL injection attempts
- XSS attempts
- File upload validation
- Rate limiting

### 12. Cleanup

```bash
# Stop servers
Ctrl+C

# Clean up test data
psql -h localhost -U postgres -d face_recognition_db -c "DELETE FROM users WHERE email LIKE '%test%';"

# Remove uploaded files
rm -rf server/uploads/*

# Reset database (optional)
psql -h localhost -U postgres -d face_recognition_db -f database/schema.sql
```

## 🎯 Quick Test Commands

```bash
# Full setup and test
npm run install-all
npm run db:setup
npm run dev

# Test specific components
npm test                    # Run tests
npm run server             # Test backend only
npm run client             # Test frontend only
```

## 📊 Test Results Template

```
Test Date: _______________
Tester: __________________

Database Setup: [ ] Pass [ ] Fail
Environment Config: [ ] Pass [ ] Fail
Dependencies: [ ] Pass [ ] Fail
Server Startup: [ ] Pass [ ] Fail
User Registration: [ ] Pass [ ] Fail
User Login: [ ] Pass [ ] Fail
Face Detection URL: [ ] Pass [ ] Fail
Face Detection Upload: [ ] Pass [ ] Fail
Dashboard: [ ] Pass [ ] Fail
History: [ ] Pass [ ] Fail
API Endpoints: [ ] Pass [ ] Fail
Error Handling: [ ] Pass [ ] Fail
Performance: [ ] Pass [ ] Fail
Security: [ ] Pass [ ] Fail

Issues Found:
1. ________________
2. ________________
3. ________________

Notes:
________________
________________
```

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#6-troubleshooting-common-issues) section
2. Review server logs in terminal
3. Check browser console for errors
4. Verify all prerequisites are met
5. Test with a fresh database
6. Check API key validity
7. Ensure all environment variables are set

## 🎉 Success Criteria

Your local testing is successful when:
- ✅ All features work as expected
- ✅ No critical errors in console
- ✅ Face detection returns accurate results
- ✅ Database operations work correctly
- ✅ File uploads process successfully
- ✅ UI is responsive and user-friendly
- ✅ Error handling is graceful
- ✅ Performance is acceptable (< 3s response time) 