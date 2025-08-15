const Joi = require('joi');
const mongoose = require('mongoose');

// Enhanced validation schemas
const validationSchemas = {
  // User validation schemas
  user: {
    register: Joi.object({
      firstName: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
          'string.min': 'First name must be at least 2 characters long',
          'string.max': 'First name cannot exceed 50 characters',
          'string.pattern.base':
            'First name can only contain letters and spaces',
          'any.required': 'First name is required',
        }),
      lastName: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
          'string.min': 'Last name must be at least 2 characters long',
          'string.max': 'Last name cannot exceed 50 characters',
          'string.pattern.base':
            'Last name can only contain letters and spaces',
          'any.required': 'Last name is required',
        }),
      email: Joi.string().email().lowercase().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
      password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
        .required()
        .messages({
          'string.min': 'Password must be at least 8 characters long',
          'string.max': 'Password cannot exceed 128 characters',
          'string.pattern.base':
            'Password must include uppercase, lowercase, number, and special character',
          'any.required': 'Password is required',
        }),
      phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .messages({
          'string.pattern.base': 'Phone number must be 10 digits',
        }),
    }),

    login: Joi.object({
      email: Joi.string().email().lowercase().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
      password: Joi.string().required().messages({
        'any.required': 'Password is required',
      }),
    }),

    profile: Joi.object({
      firstName: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .optional()
        .messages({
          'string.min': 'First name must be at least 2 characters long',
          'string.max': 'First name cannot exceed 50 characters',
          'string.pattern.base':
            'First name can only contain letters and spaces',
        }),
      lastName: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .optional()
        .messages({
          'string.min': 'Last name must be at least 2 characters long',
          'string.max': 'Last name cannot exceed 50 characters',
          'string.pattern.base':
            'Last name can only contain letters and spaces',
        }),
      phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .messages({
          'string.pattern.base': 'Phone number must be 10 digits',
        }),
      emailNotifications: Joi.boolean().optional(),
      marketingEmails: Joi.boolean().optional(),
      language: Joi.string().valid('en', 'hi', 'es', 'fr').optional(),
      timezone: Joi.string().optional(),
    }),

    changePassword: Joi.object({
      currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required',
      }),
      newPassword: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
        .required()
        .messages({
          'string.min': 'New password must be at least 8 characters long',
          'string.max': 'New password cannot exceed 128 characters',
          'string.pattern.base':
            'New password must include uppercase, lowercase, number, and special character',
          'any.required': 'New password is required',
        }),
    }),
  },

  // Product validation schemas
  product: {
    create: Joi.object({
      name: Joi.string().min(2).max(100).trim().required().messages({
        'string.min': 'Product name must be at least 2 characters long',
        'string.max': 'Product name cannot exceed 100 characters',
        'any.required': 'Product name is required',
      }),
      description: Joi.string().max(500).optional().messages({
        'string.max': 'Product description cannot exceed 500 characters',
      }),
      price: Joi.number().positive().precision(2).required().messages({
        'number.base': 'Price must be a valid number',
        'number.positive': 'Price must be positive',
        'number.precision': 'Price can have maximum 2 decimal places',
        'any.required': 'Price is required',
      }),
      category: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        })
        .required()
        .messages({
          'any.invalid': 'Invalid category ID format',
          'any.required': 'Category is required',
        }),
      stock: Joi.number().integer().min(0).required().messages({
        'number.base': 'Stock must be a valid number',
        'number.integer': 'Stock must be a whole number',
        'number.min': 'Stock cannot be negative',
        'any.required': 'Stock is required',
      }),
      images: Joi.array().items(Joi.string().uri()).max(5).optional().messages({
        'array.max': 'Maximum 5 images allowed',
        'string.uri': 'Invalid image URL format',
      }),
    }),

    update: Joi.object({
      name: Joi.string().min(2).max(100).trim().optional().messages({
        'string.min': 'Product name must be at least 2 characters long',
        'string.max': 'Product name cannot exceed 100 characters',
      }),
      description: Joi.string().max(500).optional().messages({
        'string.max': 'Product description cannot exceed 500 characters',
      }),
      price: Joi.number().positive().precision(2).optional().messages({
        'number.base': 'Price must be a valid number',
        'number.positive': 'Price must be positive',
        'number.precision': 'Price can have maximum 2 decimal places',
      }),
      category: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        })
        .optional()
        .messages({
          'any.invalid': 'Invalid category ID format',
        }),
      stock: Joi.number().integer().min(0).optional().messages({
        'number.base': 'Stock must be a valid number',
        'number.integer': 'Stock must be a whole number',
        'number.min': 'Stock cannot be negative',
      }),
      images: Joi.array().items(Joi.string().uri()).max(5).optional().messages({
        'array.max': 'Maximum 5 images allowed',
        'string.uri': 'Invalid image URL format',
      }),
    }),
  },

  // Cart validation schemas
  cart: {
    add: Joi.object({
      productId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        })
        .required()
        .messages({
          'any.invalid': 'Invalid product ID format',
          'any.required': 'Product ID is required',
        }),
      quantity: Joi.number().integer().min(1).max(100).required().messages({
        'number.base': 'Quantity must be a valid number',
        'number.integer': 'Quantity must be a whole number',
        'number.min': 'Quantity must be at least 1',
        'number.max': 'Quantity cannot exceed 100',
        'any.required': 'Quantity is required',
      }),
    }),

    update: Joi.object({
      productId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        })
        .required()
        .messages({
          'any.invalid': 'Invalid product ID format',
          'any.required': 'Product ID is required',
        }),
      quantity: Joi.number().integer().min(0).max(100).required().messages({
        'number.base': 'Quantity must be a valid number',
        'number.integer': 'Quantity must be a whole number',
        'number.min': 'Quantity cannot be negative',
        'number.max': 'Quantity cannot exceed 100',
        'any.required': 'Quantity is required',
      }),
    }),
  },

  // Address validation schemas
  address: {
    create: Joi.object({
      addressLine1: Joi.string().min(5).max(100).trim().required().messages({
        'string.min': 'Address must be at least 5 characters long',
        'string.max': 'Address cannot exceed 100 characters',
        'any.required': 'Address is required',
      }),
      addressLine2: Joi.string().max(100).trim().optional().messages({
        'string.max': 'Address line 2 cannot exceed 100 characters',
      }),
      city: Joi.string().min(2).max(50).trim().required().messages({
        'string.min': 'City must be at least 2 characters long',
        'string.max': 'City cannot exceed 50 characters',
        'any.required': 'City is required',
      }),
      state: Joi.string().min(2).max(50).trim().required().messages({
        'string.min': 'State must be at least 2 characters long',
        'string.max': 'State cannot exceed 50 characters',
        'any.required': 'State is required',
      }),
      country: Joi.string().min(2).max(50).trim().required().messages({
        'string.min': 'Country must be at least 2 characters long',
        'string.max': 'Country cannot exceed 50 characters',
        'any.required': 'Country is required',
      }),
      pinCode: Joi.string()
        .pattern(/^[0-9]{6}$/)
        .required()
        .messages({
          'string.pattern.base': 'PIN code must be 6 digits',
          'any.required': 'PIN code is required',
        }),
      phoneNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
          'string.pattern.base': 'Phone number must be 10 digits',
          'any.required': 'Phone number is required',
        }),
    }),
  },

  // Order validation schemas
  order: {
    place: Joi.object({
      shippingAddressId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        })
        .required()
        .messages({
          'any.invalid': 'Invalid shipping address ID format',
          'any.required': 'Shipping address is required',
        }),
      paymentMode: Joi.string()
        .valid('card', 'paypal', 'upi', 'cod', 'net_banking')
        .default('cod')
        .messages({
          'any.only': 'Invalid payment mode',
        }),
    }),
  },

  // Search and filter schemas
  search: {
    products: Joi.object({
      q: Joi.string().min(1).max(100).trim().optional().messages({
        'string.min': 'Search query must be at least 1 character',
        'string.max': 'Search query cannot exceed 100 characters',
      }),
      category: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        })
        .optional()
        .messages({
          'any.invalid': 'Invalid category ID format',
        }),
      minPrice: Joi.number().positive().precision(2).optional().messages({
        'number.base': 'Minimum price must be a valid number',
        'number.positive': 'Minimum price must be positive',
        'number.precision': 'Minimum price can have maximum 2 decimal places',
      }),
      maxPrice: Joi.number()
        .positive()
        .precision(2)
        .min(Joi.ref('minPrice'))
        .optional()
        .messages({
          'number.base': 'Maximum price must be a valid number',
          'number.positive': 'Maximum price must be positive',
          'number.precision': 'Maximum price can have maximum 2 decimal places',
          'number.min': 'Maximum price must be greater than minimum price',
        }),
      inStock: Joi.boolean().optional(),
      page: Joi.number().integer().min(1).default(1).optional().messages({
        'number.base': 'Page must be a valid number',
        'number.integer': 'Page must be a whole number',
        'number.min': 'Page must be at least 1',
      }),
      limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20)
        .optional()
        .messages({
          'number.base': 'Limit must be a valid number',
          'number.integer': 'Limit must be a whole number',
          'number.min': 'Limit must be at least 1',
          'number.max': 'Limit cannot exceed 100',
        }),
    }),
  },
};

// Validation middleware factory
const createValidationMiddleware = (schemaName, schemaType) => {
  return (req, res, next) => {
    const schema = validationSchemas[schemaName]?.[schemaType];
    if (!schema) {
      return res.status(500).json({ error: 'Validation schema not found' });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errorDetails,
        message: 'Please check your input and try again',
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// ObjectId validation middleware
const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'The provided ID is not in the correct format',
    });
  }

  next();
};

// Export validation functions
module.exports = {
  validationSchemas,
  createValidationMiddleware,
  validateObjectId,

  // Pre-configured validation middleware
  registerValidation: createValidationMiddleware('user', 'register'),
  loginValidation: createValidationMiddleware('user', 'login'),
  profileValidation: createValidationMiddleware('user', 'profile'),
  changePasswordValidation: createValidationMiddleware(
    'user',
    'changePassword'
  ),
  productValidation: createValidationMiddleware('product', 'create'),
  productUpdateValidation: createValidationMiddleware('product', 'update'),
  cartValidation: createValidationMiddleware('cart', 'add'),
  cartUpdateValidation: createValidationMiddleware('cart', 'update'),
  addressValidation: createValidationMiddleware('address', 'create'),
  orderValidation: createValidationMiddleware('order', 'place'),
  searchValidation: createValidationMiddleware('search', 'products'),
};
