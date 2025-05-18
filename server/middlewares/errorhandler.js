export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
    res.status(statusCode).json({
        success: false,
        message: err.message || 'something went wrong',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
}