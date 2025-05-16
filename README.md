# Functional Body Building

## Project Overview

Functional Body Building is a web application designed to help users manage workout programs, track their progress, and access exercise information. The application allows users to create, view, and mark workouts as completed, with features for user authentication and password management.

## Key Features

- **User Authentication**: Complete authentication system with login, registration, and password reset functionality
- **Workout Management**: Create and manage workout programs with detailed sections
- **Exercise Library**: Store and access movement/exercise information with video links
- **Progress Tracking**: Mark workouts as completed and view workout history
- **Responsive Design**: Works across different device sizes

## Technical Stack

- **Frontend**: Next.js (React framework)
- **Backend**: Next.js API routes
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: Custom authentication with session management
- **Styling**: CSS with responsive design principles
- **UI Components**: Custom components with Lucide icons

## Project Structure

- `/app`: Next.js application routes and API endpoints
  - `/api`: Backend API routes for authentication, workouts, programs, etc.
  - `/dashboard`: User dashboard pages
  - `/forgot-password`: Password reset request page
  - `/reset-password`: Password reset confirmation page
- `/components`: Reusable UI components
- `/lib`: Utility functions and database connection
  - `/actions`: Server actions for data operations
  - `/database`: Database connection setup
  - `/session`: Session management utilities
- `/models`: MongoDB data models
- `/providers`: Context providers for state management
- `/utils`: Utility functions like email sending

## Authentication Flow

The application implements a complete authentication system:
- User registration and login
- Password reset via email
- Session-based authentication
- Protected routes requiring authentication

## Workout System

The application allows users to:
- Create workout programs with specific weeks and days
- Add detailed sections to workouts with descriptions and notes
- Mark workouts as completed or uncompleted
- View workout history and progress

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret for JWT token generation
   - `BASE_URL`: Application base URL for email links
   - Email configuration variables for password reset functionality
4. Run the development server with `npm run dev`
5. Access the application at `http://localhost:3000`

## Environment Variables

Create a `.env.local` file with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:3000
# Email configuration for password reset
EMAIL_SERVER=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.