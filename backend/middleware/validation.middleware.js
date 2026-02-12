import { body, param, query, validationResult } from 'express-validator';

// Helper function to handle validation results
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            error: {
                code: 'VALIDATION_ERROR',
                details: errors.array()
            }
        });
    }
    next();
};

// Auth validations
export const validateSignup = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .isIn(['SUPER_ADMIN', 'RESTAURANT_ADMIN'])
        .withMessage('Role must be either SUPER_ADMIN or RESTAURANT_ADMIN'),
    handleValidationErrors
];

export const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

export const validateGoogleLogin = [
    body('token')
        .notEmpty()
        .withMessage('Google token is required'),
    handleValidationErrors
];

// Restaurant validations
export const validateCreateRestaurant = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Restaurant name must be between 2 and 100 characters'),
    body('owner_id')
        .isInt({ min: 1 })
        .withMessage('Valid owner_id is required'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters'),
    handleValidationErrors
];

export const validateUpdateRestaurant = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Restaurant name must be between 2 and 100 characters'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters'),
    handleValidationErrors
];

// Table validations
export const validateCreateTable = [
    body('table_number')
        .trim()
        .notEmpty()
        .withMessage('Table number is required')
        .isLength({ min: 1, max: 20 })
        .withMessage('Table number must be between 1 and 20 characters'),
    handleValidationErrors
];

export const validateUpdateTable = [
    body('table_number')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Table number cannot be empty')
        .isLength({ min: 1, max: 20 })
        .withMessage('Table number must be between 1 and 20 characters'),
    handleValidationErrors
];

// Subscription validations
export const validateCreateSubscription = [
    body('restaurant_id')
        .isInt({ min: 1 })
        .withMessage('Valid restaurant_id is required'),
    body('plan')
        .trim()
        .notEmpty()
        .withMessage('Plan is required')
        .isIn(['BASIC', 'PREMIUM', 'ENTERPRISE'])
        .withMessage('Plan must be BASIC, PREMIUM, or ENTERPRISE'),
    body('starts_at')
        .isISO8601()
        .withMessage('starts_at must be a valid date'),
    body('ends_at')
        .isISO8601()
        .withMessage('ends_at must be a valid date')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.starts_at)) {
                throw new Error('ends_at must be after starts_at');
            }
            return true;
        }),
    handleValidationErrors
];

// Session validations
export const validateStartSession = [
    body('qr_token')
        .trim()
        .notEmpty()
        .withMessage('QR token is required')
        .isLength({ min: 10 })
        .withMessage('Invalid QR token format'),
    handleValidationErrors
];

export const validateCancelSession = [
    body('session_id')
        .isInt({ min: 1 })
        .withMessage('Valid session_id is required'),
    handleValidationErrors
];

// Parameter validations
export const validateIdParam = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Valid ID is required'),
    handleValidationErrors
];

// Query validations
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
];

