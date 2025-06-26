# Database Setup Guide

This guide will help you set up the MySQL database for the Contact Manager application.

## Prerequisites

- MySQL server running (local or remote)
- Node.js and npm/bun installed
- Access to MySQL with CREATE DATABASE privileges

## Environment Configuration

Create a `.env` file in the server directory with the following variables:

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

## Database Initialization

### First Time Setup

To create the database and tables for the first time:

```bash
npm run init-db
```

This command will:
- Connect to MySQL server
- Create the `contacts_db` database if it doesn't exist
- Create all necessary tables with proper indexes
- Insert sample data for testing
- Display a summary of the setup

### Reset Database

To completely reset the database (drops and recreates everything):

```bash
npm run reset-db
```

⚠️ **Warning**: This will delete all existing data!

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_name (name),
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
);
```

## Sample Data

The initialization script includes sample data for testing:

### Test User
- **Email**: test@example.com
- **Password**: test123
- **Name**: Test User

### Sample Contacts
The test user has 5 sample contacts:
- John Doe (Work contact)
- Jane Smith (Personal friend)
- Bob Johnson (Business partner)
- Alice Brown (College friend)
- Charlie Wilson (Neighbor)

## Database Features

### Indexes
- **Users**: Email and creation date indexes for fast lookups
- **Contacts**: User ID, name, email, phone, and creation date indexes
- **Foreign Key**: Contacts are linked to users with CASCADE delete

### Security
- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- User-specific data isolation

### Performance
- Optimized indexes for common queries
- Connection pooling for efficient database connections
- Prepared statements to prevent SQL injection

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure MySQL server is running
   - Check host and port in `.env` file
   - Verify firewall settings

2. **Access Denied**
   - Check username and password in `.env`
   - Ensure user has CREATE DATABASE privileges
   - Verify SSL certificate path if using remote database

3. **SSL Certificate Error**
   - Update the certificate path in `init-database.ts`
   - Or remove SSL configuration for local development

### Manual Setup

If the automated scripts fail, you can manually create the database:

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```

2. Create database:
   ```sql
   CREATE DATABASE contacts_db;
   USE contacts_db;
   ```

3. Run the schema:
   ```bash
   mysql -u root -p contacts_db < src/database/schema.sql
   ```

4. Run the seed data:
   ```bash
   mysql -u root -p contacts_db < src/database/seed.sql
   ```

## Development Workflow

1. **Initial Setup**: Run `npm run init-db`
2. **Development**: Use `npm run dev` to start the server
3. **Reset Data**: Use `npm run reset-db` to start fresh
4. **Production**: Ensure proper environment variables and SSL certificates

## Backup and Restore

### Backup
```bash
mysqldump -u root -p contacts_db > backup.sql
```

### Restore
```bash
mysql -u root -p contacts_db < backup.sql
``` 