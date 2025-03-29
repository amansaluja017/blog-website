# Modern Blog Application

A full-stack blog application built with React, TypeScript, Express, and MongoDB. Features user authentication, blog post creation/management, and a modern UI using Tailwind CSS.

## Features

- 🔐 User Authentication (Local & Google OAuth)
- 📝 Create, Read, Update, Delete Blog Posts
- 🖼️ Image Upload Support
- 💅 Modern UI with Tailwind CSS & DaisyUI
- 🔍 Search Functionality
- 📱 Responsive Design

## Tech Stack

### Frontend
- React with TypeScript
- Redux Toolkit for State Management
- TailwindCSS & DaisyUI for Styling
- Google OAuth Integration
- Vite as Build Tool

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for Image Storage
- Multer for File Handling

## Project Structure

```
blog-website/
├── frontend/             # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── Pages/       # Page components
│   │   ├── store/       # Redux store configuration
│   │   └── utils/       # Utility functions
│   └── ...
└── backend/             # Express backend application
    ├── src/
    │   ├── controllers/ # Request handlers
    │   ├── models/      # Database models
    │   ├── routes/      # API routes
    │   ├── utils/       # Utility functions
    │   └── middlewares/ # Custom middlewares
    └── ...
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/amansaluja017/blog-website.git
cd blog-website
```

2. Install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Set up environment variables:

Frontend (.env):
```
VITE_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Backend (.env):
```
PORT=8000
MONGO_URI=your_mongodb_uri
SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_API_KEY=your_cloudinary_secret_key
```

4. Run the application:

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

## Features in Detail

### Authentication
- Local authentication with email and password
- Google OAuth integration
- JWT-based session management
- Password update functionality

### Blog Management
- Create new blog posts with rich text editor
- Upload cover images for blogs
- Edit existing blog posts
- Delete blog posts
- View all blogs and personal blogs
- Search blogs by title/content

### User Profile
- Update user details
- Change password
- View personal blog posts
- Google-authenticated users can set password

## API Endpoints

### User Routes
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/googleLogin` - Google OAuth login
- `POST /api/v1/users/logout` - Logout user
- `PATCH /api/v1/users/update-details` - Update user details
- `PATCH /api/v1/users/update-password` - Update password
- `PATCH /api/v1/users/set-password` - Set password (Google users)

### Blog Routes
- `POST /api/v1/blogs/post` - Create new blog
- `GET /api/v1/blogs/getBlogs` - Get all blogs
- `GET /api/v1/blogs/getMyBlogs` - Get user's blogs
- `PATCH /api/v1/blogs/update-blog/:blogId` - Update blog
- `DELETE /api/v1/blogs/delete-blog/:blogId` - Delete blog

## Contributing

Feel free to open issues and pull requests for any improvements.
