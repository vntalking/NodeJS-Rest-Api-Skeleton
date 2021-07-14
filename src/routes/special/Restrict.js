// Authorization check if the user have rights to do this action
exports.restrictTo = (...provider) => {
    return (req, res, next) => {
        if (!provider.includes(req.providerId)) {
            return next(new AppError(403, 'failed', 'You are not allowed to do this action'), req, res, next);
        }
        next();
    };
};