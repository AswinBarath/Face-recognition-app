# Production Deployment Guide

This guide will help you deploy the Face Recognition App to production.

## 🚀 Deployment Options

### Option 1: Heroku (Recommended for beginners)

#### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

#### Steps

1. **Create Heroku App**
```bash
heroku create your-face-recognition-app
```

2. **Add PostgreSQL Addon**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secure_jwt_secret_here
heroku config:set CLARIFAI_API_KEY=your_clarifai_api_key
heroku config:set CORS_ORIGIN=https://your-app-name.herokuapp.com
```

4. **Build and Deploy**
```bash
npm run build
git add .
git commit -m "Prepare for production"
git push heroku main
```

5. **Run Database Migrations**
```bash
heroku run psql $DATABASE_URL -f database/schema.sql
```

### Option 2: Vercel (Frontend) + Railway/Render (Backend)

#### Prerequisites
- Vercel account
- Railway or Render account
- Git repository

#### Backend Deployment (Railway)

1. **Deploy Backend to Railway**
   - Connect your GitHub repository to Railway
   - Set the root directory to `/server`
   - Add environment variables in Railway dashboard

2. **Configure Environment Variables**
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_railway_db_host
DB_PORT=5432
DB_NAME=face_recognition_db
DB_USER=your_railway_db_user
DB_PASSWORD=your_railway_db_password
JWT_SECRET=your_secure_jwt_secret_here
CLARIFAI_API_KEY=your_clarifai_api_key
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

3. **Database Setup**
   - Railway will automatically provision a PostgreSQL database
   - Run the schema: `psql $DATABASE_URL -f database/schema.sql`

#### Frontend Deployment (Vercel)

1. **Deploy Frontend to Vercel**
   - Connect your GitHub repository to Vercel
   - Set the root directory to `/client`
   - Set build command: `npm run build`
   - Set output directory: `build`

2. **Configure Environment Variables**
```env
REACT_APP_API_URL=https://your-railway-backend.railway.app
```

3. **Create vercel.json Configuration**
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-backend.railway.app/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Option 3: DigitalOcean App Platform

1. **Connect Repository**
   - Connect your GitHub repository to DigitalOcean App Platform

2. **Configure Environment**
   - Set environment variables in the DigitalOcean dashboard
   - Add PostgreSQL database service

3. **Deploy**
   - DigitalOcean will automatically build and deploy your app

### Option 4: AWS EC2

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu recommended)
- Domain name (optional)

#### Steps

1. **Launch EC2 Instance**
   - Use Ubuntu 20.04 LTS
   - Configure security groups for ports 22, 80, 443

2. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib nginx
```

3. **Setup PostgreSQL**
```bash
sudo -u postgres createdb face_recognition_db
sudo -u postgres psql -d face_recognition_db -f database/schema.sql
```

4. **Deploy Application**
```bash
git clone your-repository
cd face-recognition-app
npm run install-all
npm run build
```

5. **Setup PM2**
```bash
npm install -g pm2
pm2 start server/server.js --name "face-recognition-app"
pm2 startup
pm2 save
```

6. **Setup Nginx**
```bash
sudo nano /etc/nginx/sites-available/face-recognition-app
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/face-recognition-app/client/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/face-recognition-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Production Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=face_recognition_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# CORS Configuration
CORS_ORIGIN=https://your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Face Detection API
CLARIFAI_API_KEY=your_clarifai_api_key
```

### Security Considerations

1. **JWT Secret**: Use a strong, random secret (at least 32 characters)
2. **Database Password**: Use a strong password
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Adjust based on your needs
5. **CORS**: Only allow your domain

## 📊 Monitoring and Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### Health Checks
- Endpoint: `GET /api/health`
- Monitor response time and status

### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm run install-all
      
    - name: Run tests
      run: npm test
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
        heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify database is running
   - Check network connectivity

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

3. **CORS Errors**
   - Verify CORS_ORIGIN is set correctly
   - Check if frontend and backend URLs match

4. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Check disk space

### Performance Optimization

1. **Database Indexing**
   - Ensure proper indexes on frequently queried columns
   - Monitor query performance

2. **Caching**
   - Implement Redis for session storage
   - Cache API responses where appropriate

3. **CDN**
   - Use CDN for static assets
   - Optimize images before upload

## 📈 Scaling Considerations

1. **Database Scaling**
   - Consider read replicas for heavy read loads
   - Implement connection pooling

2. **Application Scaling**
   - Use load balancers for multiple instances
   - Implement horizontal scaling

3. **File Storage**
   - Use cloud storage (AWS S3, Google Cloud Storage)
   - Implement image optimization

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Strong JWT secret
- [ ] Database credentials secured
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] File upload validation
- [ ] Error messages don't expose sensitive data
- [ ] Regular security updates
- [ ] Monitoring and alerting setup

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section
2. Review server logs
3. Verify environment configuration
4. Test locally with production settings
5. Check the README.md for additional guidance 