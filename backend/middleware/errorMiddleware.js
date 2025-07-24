const errorHandler = (err, req, res, next) => {
    // Log the error for the developer
    console.error(err.stack);

    // Default to 500 server error
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Internal Server Error';

    // Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };