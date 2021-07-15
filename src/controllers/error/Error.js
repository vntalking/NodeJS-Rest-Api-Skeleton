// Express automatically knows that this entire function is an error handling middleware by specifying 4 parameters
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 200;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
    });

};