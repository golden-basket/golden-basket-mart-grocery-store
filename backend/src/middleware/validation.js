const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');

// Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
};

// Validation rules for user registration
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/)
    .withMessage('Password must include uppercase, lowercase, number, and special character'),
];

// Validation rules for user login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation rules for creating users (admin only)
const createUserValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"'),
];

// Validation rules for product creation/update
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),
];

// Validation rules for cart operations
const cartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
];

// Validation rules for address operations
const addressValidation = [
  body('addressLine1')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Address line 1 must be between 5 and 100 characters'),
  
  body('addressLine2')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Address line 2 cannot exceed 100 characters'),
  
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  
  body('country')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
  
  body('pinCode')
    .matches(/^\d{6}$/)
    .withMessage('Pin code must be exactly 6 digits'),
  
  body('phoneNumber')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
];

// Validation rules for order placement
const orderValidation = [
  body('shippingAddressId')
    .optional()
    .isMongoId()
    .withMessage('Invalid shipping address ID format'),
  
  body('paymentMode')
    .optional()
    .isIn(['card', 'paypal', 'upi', 'cod', 'net_banking'])
    .withMessage('Invalid payment mode'),
];

// Generic validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

module.exports = {
  validateObjectId,
  registerValidation,
  loginValidation,
  createUserValidation,
  productValidation,
  cartValidation,
  addressValidation,
  orderValidation,
  handleValidationErrors,
}; 