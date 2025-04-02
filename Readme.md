# Modern Blog Website

A full-stack modern blog platform built with React, TypeScript, and Node.js. Features a rich text editor, authentication, and responsive design.

## Key Features

- 🎨 Rich Text Editor with TipTap
- 🔒 Multi-mode Authentication (Email & Google OAuth)
- 📱 Responsive Design with Tailwind CSS & DaisyUI
- 🌓 Dark/Light Theme Support
- 🖼️ Image Upload with Cloudinary
- 🔑 Password Recovery System
- 👤 User Profile Management
- ✍️ Blog Management (CRUD Operations)
- 🎯 Protected Routes
- 🔍 Content Search

## Technology Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Redux Toolkit for state management
- TipTap for rich text editing
- Tailwind CSS & DaisyUI for styling
- React Router v7 for routing
- Axios for API calls
- Google OAuth integration

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for media storage
- Nodemailer for emails
- bcrypt for password hashing

## Project Structure

```
blog-website/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── Pages/        # Page components
│   │   ├── store/        # Redux store
│   │   └── main.tsx      # App entry point
│   ├── public/           # Static assets
│   └── index.html        # HTML template
└── backend/
    ├── src/
    │   ├── controllers/  # Request handlers
    │   ├── models/       # Database schemas
    │   ├── routes/       # API routes
    │   └── utils/        # Helper functions
    └── index.ts          # Server entry point
```

## Setup Instructions

1. **Clone Repository**
```bash
git clone https://github.com/amansaluja017/blog-website.git
cd blog-website
```

2. **Environment Variables**

Frontend (.env):
```
VITE_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Backend (.env):
```
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

3. **Install Dependencies & Run**

```bash
# Frontend Setup
cd frontend
npm install
npm run dev

# Backend Setup
cd ../backend
npm install
npm run dev
```

## API Documentation

### Authentication Endpoints
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - Email login
- `POST /api/v1/users/google-login` - Google OAuth login
- `POST /api/v1/users/forgot-password` - Password recovery
- `POST /api/v1/users/reset-password` - Reset password
- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update profile

### Blog Endpoints
- `GET /api/v1/blogs` - List all blogs
- `GET /api/v1/blogs/:id` - Get single blog
- `POST /api/v1/blogs` - Create blog
- `PUT /api/v1/blogs/:id` - Update blog
- `DELETE /api/v1/blogs/:id` - Delete blog
- `GET /api/v1/blogs/my-blogs` - User's blogs

## Features in Detail

### Rich Text Editor
- TipTap integration
- Multiple formatting options
- Image embedding
- Real-time preview

### Authentication System
- JWT-based authentication
- Google OAuth integration
- Password recovery via email
- Protected route middleware

### User Management
- Profile customization
- Password management
- Blog management
- Activity tracking

### Blog Features
- Create/Edit/Delete posts
- Rich text content
- Cover image upload
- Author attribution
- Search functionality

## Contribution

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License
