# Blog Website with Microservices Architecture

A full-stack blog platform built with TypeScript, React, Express, and Node.js using a microservices architecture.

## Features

- **User Service**
  - User authentication (Local & Google OAuth)
  - Email verification
  - Password management
  - Profile updates
  - Follow/Unfollow system
  - Password reset
  
- **Blog Service**
  - Create, read, update, delete blogs
  - Like/Unlike blogs
  - View count tracking
  - Cover image upload
  - Rich text editor

- **Admin Service**
  - Admin dashboard
  - User management
  - Analytics
  - Content moderation

- **Comment Service**
  - Add/delete comments
  - Nested comments support

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- TailwindCSS
- Redux Toolkit
- React Router

### Backend
- Node.js with TypeScript
- Express.js
- MongoDB
- RabbitMQ for inter-service communication
- JWT Authentication
- Cloudinary for image storage
- Nodemailer for email services

## Microservices Architecture

1. **User Service**: Handles user authentication and profile management
2. **Blog Service**: Manages blog posts and related operations
3. **Admin Service**: Provides administrative functionalities
4. **Comment Service**: Manages comment system
5. **API Gateway**: Routes requests to appropriate services

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- RabbitMQ
- TypeScript

### Environment Variables

Create .env files in each service directory:

```env
# Common
NODE_ENV=development
PORT=xxxx
MONGODB_URI=your_mongodb_uri
SECRET=your_jwt_secret
RABBIT_URL=amqp://localhost:5672

# User Service
GOOGLE_CLIENT_ID=your_google_client_id
NODEMAILER_USER=your_email
NODEMAILER_PASS=your_email_password

# For image upload
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amansaluja017/blog-website.git
cd blog-website
```

2. Install dependencies for all services:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend service dependencies
cd ../backend/user_service
npm install

cd ../blog_service
npm install

cd ../admin_service
npm install

cd ../comment_service
npm install

cd ../gateway
npm install
```

3. Start the services:

```bash
# Start RabbitMQ (if using Docker)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

# Start each service
# In separate terminals:

# Frontend
cd frontend
npm run dev

# User Service
cd backend/user_service
npm run dev

# Blog Service
cd backend/blog_service
npm run dev

# Admin Service
cd backend/admin_service
npm run dev

# Comment Service
cd backend/comment_service
npm run dev

# Gateway
cd backend/gateway
npm run dev
```

## API Documentation

### User Service Endpoints
- POST /register - Register new user
- POST /login - User login
- GET /current-user - Get current user
- PATCH /update-details - Update user details
- POST /verify-email - Send email verification
- POST /verify-otp - Verify email OTP

### Blog Service Endpoints
- POST /post - Create new blog
- GET /getBlogs - Get all blogs
- GET /getMyBlogs - Get user's blogs
- PATCH /update-blog/:blogId - Update blog
- DELETE /delete-blog/:blogId - Delete blog
- POST /like-blog/:blogId - Toggle like on blog

### Admin Service Endpoints
- GET /dashboard-stats - Get dashboard statistics
- GET /users - Get all users
- DELETE /users/:userId - Delete user
- PATCH /users/:userId/toggle-block - Block/unblock user

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
