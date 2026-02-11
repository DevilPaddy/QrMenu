// Standardized response helper functions...

export const successResponse = (res, message, data = null, statusCode = 200) => {
    const response = {
        success: true,
        message,
    };
    
    if (data !== null) {
        response.data = data;
    }
    
    return res.status(statusCode).json(response);
};

export const errorResponse = (res, message, errorCode = 'INTERNAL_ERROR', details = null, statusCode = 500) => {
    const response = {
        success: false,
        message,
        error: {
            code: errorCode,
        }
    };
    
    if (details !== null) {
        response.error.details = details;
    }
    
    return res.status(statusCode).json(response);
};

export const validationErrorResponse = (res, errors) => {
    return res.status(422).json({
        success: false,
        message: 'Validation failed',
        error: {
            code: 'VALIDATION_ERROR',
            details: errors
        }
    });
};

export const notFoundResponse = (res, resource = 'Resource') => {
    return res.status(404).json({
        success: false,
        message: `${resource} not found`,
        error: {
            code: 'NOT_FOUND'
        }
    });
};

export const unauthorizedResponse = (res, message = 'Unauthorized access') => {
    return res.status(401).json({
        success: false,
        message,
        error: {
            code: 'UNAUTHORIZED'
        }
    });
};

export const forbiddenResponse = (res, message = 'Access forbidden') => {
    return res.status(403).json({
        success: false,
        message,
        error: {
            code: 'FORBIDDEN'
        }
    });
};

export const conflictResponse = (res, message, details = null) => {
    return res.status(409).json({
        success: false,
        message,
        error: {
            code: 'CONFLICT',
            details
        }
    });
};