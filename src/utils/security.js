// Security Utilities
// Comprehensive security functions for input validation and sanitization

import DOMPurify from 'dompurify';
import validator from 'validator';

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - Potentially unsafe HTML string
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (dirty) => {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: []
  });
};

/**
 * Sanitize user input for text fields
 * @param {string} input - User input
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized string
 */
export const sanitizeTextInput = (input, maxLength = 1000) => {
  if (!input || typeof input !== 'string') return '';

  // Remove HTML tags
  let sanitized = sanitizeHTML(input);

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  return sanitized;
};

/**
 * Sanitize file name
 * @param {string} fileName - File name to sanitize
 * @returns {string} - Safe file name
 */
export const sanitizeFileName = (fileName) => {
  if (!fileName || typeof fileName !== 'string') return 'untitled';

  // Remove path traversal attempts
  let safe = fileName.replace(/\.\./g, '');

  // Remove special characters except dash, underscore, and dot
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Prevent hidden files
  if (safe.startsWith('.')) {
    safe = safe.substring(1);
  }

  // Limit length
  if (safe.length > 255) {
    const ext = safe.split('.').pop();
    const name = safe.substring(0, 250);
    safe = `${name}.${ext}`;
  }

  return safe || 'untitled';
};

// ============================================
// INPUT VALIDATION
// ============================================

/**
 * Validate wheel/list option name
 * @param {string} name - Option name
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateOptionName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name cannot be empty' };
  }

  const sanitized = sanitizeTextInput(name, 200);

  if (sanitized.length === 0) {
    return { valid: false, error: 'Name cannot be empty' };
  }

  if (sanitized.length > 200) {
    return { valid: false, error: 'Name is too long (max 200 characters)' };
  }

  return { valid: true, sanitized };
};

/**
 * Validate color hex code
 * @param {string} color - Hex color code
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateColorHex = (color) => {
  if (!color || typeof color !== 'string') {
    return { valid: false, error: 'Invalid color format' };
  }

  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (!hexPattern.test(color)) {
    return { valid: false, error: 'Invalid hex color code' };
  }

  return { valid: true, sanitized: color.toUpperCase() };
};

/**
 * Validate number input
 * @param {any} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateNumber = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = parseInt(value, 10);

  if (isNaN(num)) {
    return { valid: false, error: 'Must be a valid number' };
  }

  if (num < min) {
    return { valid: false, error: `Must be at least ${min}` };
  }

  if (num > max) {
    return { valid: false, error: `Must be at most ${max}` };
  }

  return { valid: true, sanitized: num };
};

/**
 * Validate Excel file upload
 * @param {File} file - File object
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateExcelFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }

  // Check file type
  const allowedExtensions = ['.xlsx', '.xls', '.csv'];
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ];

  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  const hasValidMimeType = allowedMimeTypes.includes(file.type);

  if (!hasValidExtension && !hasValidMimeType) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload .xlsx, .xls, or .csv files only'
    };
  }

  return { valid: true };
};

/**
 * Validate array of names from Excel
 * @param {Array} names - Array of names
 * @param {number} maxItems - Maximum number of items
 * @returns {Object} - {valid: boolean, sanitized: Array, errors: Array}
 */
export const validateNamesList = (names, maxItems = 1000) => {
  if (!Array.isArray(names)) {
    return { valid: false, errors: ['Invalid data format'] };
  }

  if (names.length === 0) {
    return { valid: false, errors: ['No names found in file'] };
  }

  if (names.length > maxItems) {
    return {
      valid: false,
      errors: [`Too many items (max ${maxItems}). Found ${names.length}`]
    };
  }

  const sanitized = [];
  const errors = [];

  names.forEach((name, index) => {
    const validation = validateOptionName(name);
    if (validation.valid) {
      sanitized.push(validation.sanitized);
    } else {
      errors.push(`Row ${index + 1}: ${validation.error}`);
    }
  });

  if (sanitized.length === 0) {
    return { valid: false, errors: ['No valid names found'] };
  }

  return { valid: true, sanitized, errors };
};

// ============================================
// RATE LIMITING (CLIENT-SIDE)
// ============================================

class RateLimiter {
  constructor() {
    this.limits = new Map();
  }

  /**
   * Check if action is allowed under rate limit
   * @param {string} key - Unique key for the action
   * @param {number} maxAttempts - Maximum attempts allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {boolean} - True if action is allowed
   */
  checkLimit(key, maxAttempts = 10, windowMs = 60000) {
    const now = Date.now();
    const record = this.limits.get(key) || { attempts: [], blocked: false };

    // Clear old attempts outside the window
    record.attempts = record.attempts.filter(time => now - time < windowMs);

    // Check if blocked
    if (record.blocked && now - record.blockedAt < windowMs) {
      return false;
    }

    // Check if limit exceeded
    if (record.attempts.length >= maxAttempts) {
      record.blocked = true;
      record.blockedAt = now;
      this.limits.set(key, record);
      return false;
    }

    // Add new attempt
    record.attempts.push(now);
    record.blocked = false;
    this.limits.set(key, record);

    return true;
  }

  /**
   * Clear rate limit for a key
   * @param {string} key - Unique key for the action
   */
  clear(key) {
    this.limits.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// ============================================
// SECURE STORAGE
// ============================================

/**
 * Securely store data in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const secureStore = (key, value) => {
  try {
    const sanitizedKey = sanitizeTextInput(key, 100);
    const data = JSON.stringify(value);
    localStorage.setItem(sanitizedKey, data);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

/**
 * Securely retrieve data from localStorage
 * @param {string} key - Storage key
 * @returns {any} - Retrieved value or null
 */
export const secureRetrieve = (key) => {
  try {
    const sanitizedKey = sanitizeTextInput(key, 100);
    const data = localStorage.getItem(sanitizedKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

/**
 * Securely remove data from localStorage
 * @param {string} key - Storage key
 */
export const secureRemove = (key) => {
  try {
    const sanitizedKey = sanitizeTextInput(key, 100);
    localStorage.removeItem(sanitizedKey);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

// ============================================
// CONSTANTS
// ============================================

export const SECURITY_LIMITS = {
  MAX_OPTION_LENGTH: 200,
  MAX_OPTIONS_COUNT: 1000,
  MAX_TEAMS_COUNT: 100,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_COLORS_COUNT: 100,
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  RATE_LIMIT_ATTEMPTS: 10
};

export default {
  sanitizeHTML,
  sanitizeTextInput,
  sanitizeFileName,
  validateOptionName,
  validateColorHex,
  validateNumber,
  validateExcelFile,
  validateNamesList,
  rateLimiter,
  secureStore,
  secureRetrieve,
  secureRemove,
  SECURITY_LIMITS
};
