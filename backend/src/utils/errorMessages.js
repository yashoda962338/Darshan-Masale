module.exports = {
  // General Errors
  INTERNAL_SERVER_ERROR: 'Internal server error occurred',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  
  // Validation Errors
  VALIDATION_ERROR: 'Validation failed',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PHONE: 'Invalid phone number',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  
  // Auth Errors
  AUTH_FAILED: 'Authentication failed',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Invalid token',
  
  // Database Errors
  DUPLICATE_ENTRY: 'Duplicate entry found',
  DB_CONNECTION_FAILED: 'Database connection failed',
  
  // Upload Errors
  UPLOAD_ERROR: 'File upload failed',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File size too large',
};