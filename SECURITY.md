# Security Implementation Guide

This document outlines the secure authentication implementation using HTTP-only cookies.

## 🔒 Security Features

### Cookie-Based Authentication
- **HTTP-Only Cookies**: JWT tokens are stored in HTTP-only cookies, preventing XSS attacks
- **Secure Flag**: Cookies are marked as secure in production (HTTPS only)
- **SameSite Strict**: Prevents CSRF attacks by restricting cookie transmission
- **Automatic Expiration**: 24-hour cookie lifetime with automatic cleanup

### Server-Side Security
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **JWT Tokens**: Signed tokens with configurable expiration
- **CORS Configuration**: Proper CORS setup with credentials support
- **Input Validation**: Request validation and sanitization

## 🍪 Cookie Configuration

### Cookie Settings
```javascript
res.cookie('auth_token', token, {
    httpOnly: true,           // Prevents JavaScript access
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',       // Prevents CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/'                 // Available across the entire site
});
```

### Security Benefits
1. **XSS Protection**: `httpOnly: true` prevents JavaScript access to cookies
2. **CSRF Protection**: `sameSite: 'strict'` prevents cross-site requests
3. **HTTPS Enforcement**: `secure: true` in production ensures HTTPS-only transmission
4. **Automatic Cleanup**: `maxAge` ensures cookies expire automatically

## 🔐 Authentication Flow

### Login Process
1. User submits credentials
2. Server validates credentials against database
3. Server generates JWT token
4. Server sets HTTP-only cookie with token
5. Server returns user data (no token in response body)
6. Client stores user data in state

### Authentication Check
1. Client makes request to `/auth/me`
2. Server reads token from HTTP-only cookie
3. Server validates JWT token
4. Server returns user data if valid
5. Client updates authentication state

### Logout Process
1. Client calls `/auth/logout`
2. Server clears HTTP-only cookie
3. Client clears local state
4. Client redirects to login page

## 🛡️ Security Headers

### CORS Configuration
```javascript
app.use(cors({
    origin: 'http://localhost:5173', // Specific origin
    credentials: true                 // Allow cookies
}));
```

### Axios Configuration
```javascript
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true, // Send cookies with requests
});
```

## 🔍 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user (protected)

### Protected Endpoints
All contact endpoints require authentication:
- `GET /api/contacts` - Get user's contacts
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

## 🚨 Security Best Practices

### Environment Variables
```env
# Production Environment
NODE_ENV=production
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Database
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Use secure database connections
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up monitoring

## 🔧 Development vs Production

### Development
- `secure: false` - Allows HTTP cookies for local development
- `origin: 'http://localhost:5173'` - Specific dev server origin
- Debug logging enabled

### Production
- `secure: true` - HTTPS-only cookies
- Specific production origins
- Minimal logging
- Rate limiting enabled

## 🐛 Troubleshooting

### Common Issues

1. **Cookies Not Sent**
   - Ensure `withCredentials: true` in axios
   - Check CORS `credentials: true` setting
   - Verify cookie domain and path

2. **Authentication Fails**
   - Check JWT secret configuration
   - Verify cookie expiration
   - Ensure proper CORS setup

3. **CSRF Issues**
   - Verify `sameSite: 'strict'` setting
   - Check request origins
   - Ensure proper CORS configuration

### Debug Commands
```bash
# Check cookies in browser
document.cookie

# Check server logs
npm run dev

# Test authentication
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: auth_token=your-token"
```

## 📚 Additional Security Measures

### Recommended Additions
1. **Rate Limiting**: Implement request rate limiting
2. **Request Logging**: Log authentication attempts
3. **Account Lockout**: Lock accounts after failed attempts
4. **Password Policy**: Enforce strong password requirements
5. **Session Management**: Implement session tracking
6. **Audit Logging**: Log all authentication events

### Monitoring
- Monitor failed authentication attempts
- Track cookie usage and expiration
- Log security events
- Set up alerts for suspicious activity 