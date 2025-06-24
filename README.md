# Contact Manager with Real-time Updates

A full-stack contact management application built with React, TypeScript, Express, MySQL, and WebSocket for real-time updates.

## Features

- **User Authentication**: JWT-based authentication system
- **Contact Management**: Full CRUD operations for contacts
- **Real-time Updates**: Live updates using WebSocket (Socket.IO)
- **Search Functionality**: Search contacts by name, email, or phone
- **Responsive Design**: Modern UI with Tailwind CSS
- **Type Safety**: Full TypeScript support

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MySQL2 for database operations
- Socket.IO for WebSocket functionality
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 19 with TypeScript
- React Router for navigation
- React Hook Form with Zod validation
- Socket.IO Client for real-time updates
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- Bun (optional, for faster package management)

### Backend Setup

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
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```

4. Set up the database:
   - Create a MySQL database
   - Run the schema from `src/database/schema.sql`

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

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

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Contacts
- `GET /api/contacts` - Get all contacts for authenticated user
- `GET /api/contacts/:id` - Get specific contact
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

## WebSocket Events

### Client to Server
- Connection with JWT token for authentication

### Server to Client
- `contact_update` - Real-time contact updates (create/update/delete)

## Features in Detail

### Real-time Updates
The application uses WebSocket connections to provide real-time updates:
- When a contact is created, updated, or deleted, all connected clients receive immediate updates
- Each user only receives updates for their own contacts
- WebSocket connections are authenticated using JWT tokens

### Contact Management
- **Create**: Add new contacts with name, email, phone, address, and notes
- **Read**: View contact list with search functionality
- **Update**: Edit existing contact information
- **Delete**: Remove contacts with confirmation

### Search Functionality
- Search contacts by name, email, or phone number
- Real-time filtering as you type
- Case-insensitive search

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes on both frontend and backend
- User-specific data isolation
- Input validation and sanitization 