# Contact Manager with Authentication

A full-stack contact management application with user authentication built with React, TypeScript, Express, and MySQL.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Contact Management**: Create, read, update, and delete contacts
- **Real-time Updates**: WebSocket integration for live contact updates
- **Protected Routes**: Authentication-based route protection
- **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form with Zod validation
- Socket.io client for real-time features

### Backend
- Node.js with Express and TypeScript
- MySQL database with connection pooling
- JWT for authentication
- bcryptjs for password hashing
- Socket.io for WebSocket support
- CORS enabled for cross-origin requests

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or bun package manager

### Database Setup

1. Create a MySQL database named `contacts_db`
2. Run the SQL schema from `server/src/database/schema.sql`

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=contacts_db
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The client will start on `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Register a new account or login with existing credentials
3. Navigate to the Contacts page to manage your contacts
4. Use the navigation to switch between Home and Contacts

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Contacts (Protected)
- `GET /api/contacts` - Get all contacts for the authenticated user
- `GET /api/contacts/:id` - Get a specific contact
- `POST /api/contacts` - Create a new contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── apps/          # Application components
│   │   │   ├── (pages)/   # Page components
│   │   │   ├── components/ # Reusable components
│   │   │   └── layouts/   # Layout components
│   │   ├── libs/          # Utilities and hooks
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── database/      # Database schema
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
│   └── package.json
└── README.md
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- Input validation with Zod
- CORS configuration
- SQL injection prevention with parameterized queries

## Development

- The server uses TypeScript with hot reloading
- The client uses Vite for fast development builds
- Both frontend and backend have proper TypeScript configurations
- ESLint is configured for code quality 