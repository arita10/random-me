// utils/validation.js - Input Validation and Sanitization
// Place this in: src/utils/validation.js

/**
 * Security utilities for input validation and sanitization
 * Prevents XSS, injection attacks, and malformed data
 */

// ============================================
// STRING VALIDATION
// ============================================

/**
 * Sanitize string input to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Max length 1000 chars
};

/**
 * Validate string length
 */
export const isValidLength = (str, min = 1, max = 1000) => {
  if (typeof str !== 'string') return false;
  const length = str.trim().length;
  return length >= min && length <= max;
};

/**
 * Check if string contains only allowed characters
 */
export const hasOnlyAllowedChars = (str, pattern = /^[a-zA-Z0-9\s\-_.,!?()]+$/) => {
  if (typeof str !== 'string') return false;
  return pattern.test(str);
};

/**
 * Validate wheel/deck name
 */
export const validateName = (name) => {
  const sanitized = sanitizeString(name);
  
  if (!isValidLength(sanitized, 1, 100)) {
    return { valid: false, error: 'Name must be between 1 and 100 characters' };
  }
  
  if (!/^[a-zA-Z0-9\s\-_.,!?()]+$/.test(sanitized)) {
    return { valid: false, error: 'Name contains invalid characters' };
  }
  
  return { valid: true, value: sanitized };
};

// ============================================
// NUMBER VALIDATION
// ============================================

/**
 * Validate number is within range
 */
export const validateNumber = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Invalid number' };
  }
  
  if (num < min || num > max) {
    return { valid: false, error: `Number must be between ${min} and ${max}` };
  }
  
  return { valid: true, value: num };
};

/**
 * Validate integer
 */
export const validateInteger = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const result = validateNumber(value, min, max);
  
  if (!result.valid) return result;
  
  if (!Number.isInteger(result.value)) {
    return { valid: false, error: 'Must be a whole number' };
  }
  
  return result;
};

// ============================================
// ARRAY VALIDATION
// ============================================

/**
 * Validate array of options (for wheel/cards)
 */
export const validateOptions = (options, minItems = 2, maxItems = 100) => {
  if (!Array.isArray(options)) {
    return { valid: false, error: 'Options must be an array' };
  }
  
  if (options.length < minItems) {
    return { valid: false, error: `Must have at least ${minItems} options` };
  }
  
  if (options.length > maxItems) {
    return { valid: false, error: `Cannot exceed ${maxItems} options` };
  }
  
  // Sanitize each option
  const sanitized = options.map(opt => {
    if (typeof opt === 'string') {
      return sanitizeString(opt);
    } else if (typeof opt === 'object' && opt.text) {
      return {
        ...opt,
        text: sanitizeString(opt.text)
      };
    }
    return opt;
  });
  
  // Remove empty options
  const filtered = sanitized.filter(opt => {
    if (typeof opt === 'string') return opt.length > 0;
    if (typeof opt === 'object') return opt.text && opt.text.length > 0;
    return false;
  });
  
  if (filtered.length < minItems) {
    return { valid: false, error: `Must have at least ${minItems} valid options` };
  }
  
  return { valid: true, value: filtered };
};

// ============================================
// FILE VALIDATION
// ============================================

/**
 * Validate file upload
 */
export const validateFile = (file, allowedTypes = [], maxSizeMB = 5) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }
  
  // Check file size
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File too large. Maximum size: ${maxSizeMB}MB` 
    };
  }
  
  // Check filename
  const validFilename = /^[a-zA-Z0-9_\-. ]+$/;
  if (!validFilename.test(file.name)) {
    return { 
      valid: false, 
      error: 'Filename contains invalid characters' 
    };
  }
  
  return { valid: true, file };
};

/**
 * Validate image file specifically
 */
export const validateImage = (file, maxSizeMB = 5) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return validateFile(file, allowedTypes, maxSizeMB);
};

// ============================================
// EMAIL VALIDATION
// ============================================

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const sanitized = sanitizeString(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true, value: sanitized.toLowerCase() };
};

// ============================================
// PASSWORD VALIDATION
// ============================================

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (typeof password !== 'string') {
    return { valid: false, error: 'Password must be a string' };
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  
  if (password.length > 128) {
    return { valid: false, error: 'Password too long (max 128 characters)' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain lowercase letter' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain uppercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain number' };
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain special character' };
  }
  
  return { valid: true };
};

// ============================================
// URL VALIDATION
// ============================================

/**
 * Validate URL
 */
export const validateURL = (url) => {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs allowed' };
    }
    
    return { valid: true, value: parsed.href };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
};

// ============================================
// OBJECT VALIDATION
// ============================================

/**
 * Validate object has required fields
 */
export const validateRequiredFields = (obj, requiredFields) => {
  if (typeof obj !== 'object' || obj === null) {
    return { valid: false, error: 'Invalid object' };
  }
  
  const missingFields = requiredFields.filter(field => !(field in obj));
  
  if (missingFields.length > 0) {
    return { 
      valid: false, 
      error: `Missing required fields: ${missingFields.join(', ')}` 
    };
  }
  
  return { valid: true };
};

// ============================================
// RATE LIMITING (Client-side)
// ============================================

/**
 * Simple client-side rate limiter
 * Usage: const canProceed = checkRateLimit('wheelSpin', 1000); // 1 per second
 */
const rateLimitStore = new Map();

export const checkRateLimit = (key, minIntervalMs) => {
  const now = Date.now();
  const lastTime = rateLimitStore.get(key) || 0;
  
  if (now - lastTime < minIntervalMs) {
    return { 
      allowed: false, 
      error: 'Please wait before trying again',
      remainingMs: minIntervalMs - (now - lastTime)
    };
  }
  
  rateLimitStore.set(key, now);
  return { allowed: true };
};

// ============================================
// COMPREHENSIVE VALIDATION
// ============================================

/**
 * Validate wheel data before saving
 */
export const validateWheelData = (data) => {
  const errors = [];
  
  // Validate name
  const nameResult = validateName(data.name);
  if (!nameResult.valid) errors.push(nameResult.error);
  
  // Validate options
  const optionsResult = validateOptions(data.options, 2, 100);
  if (!optionsResult.valid) errors.push(optionsResult.error);
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    data: {
      name: nameResult.value,
      options: optionsResult.value
    }
  };
};

/**
 * Validate dice roll data
 */
export const validateDiceRoll = (sides, count = 1) => {
  const errors = [];
  
  const sidesResult = validateInteger(sides, 2, 100);
  if (!sidesResult.valid) errors.push(`Sides: ${sidesResult.error}`);
  
  const countResult = validateInteger(count, 1, 10);
  if (!countResult.valid) errors.push(`Count: ${countResult.error}`);
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    data: {
      sides: sidesResult.value,
      count: countResult.value
    }
  };
};

/**
 * Validate card deck data
 */
export const validateCardDeck = (data) => {
  const errors = [];
  
  const nameResult = validateName(data.name);
  if (!nameResult.valid) errors.push(nameResult.error);
  
  const cardsResult = validateOptions(data.cards, 1, 200);
  if (!cardsResult.valid) errors.push(cardsResult.error);
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    data: {
      name: nameResult.value,
      cards: cardsResult.value
    }
  };
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  sanitizeString,
  isValidLength,
  hasOnlyAllowedChars,
  validateName,
  validateNumber,
  validateInteger,
  validateOptions,
  validateFile,
  validateImage,
  validateEmail,
  validatePassword,
  validateURL,
  validateRequiredFields,
  checkRateLimit,
  validateWheelData,
  validateDiceRoll,
  validateCardDeck
};