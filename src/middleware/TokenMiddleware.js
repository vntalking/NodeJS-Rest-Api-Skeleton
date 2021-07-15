const {
    promisify
} = require('util');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    try {
        // 1) check if the token is there
        let token = req.headers["x-access-token"];

        if (typeof token == 'undefined' || token == null || token === 'null' || token === '') {
            return next(new AppError(401, 'failed', 'You are not logged in! Please login in to continue'), req, res, next);
        }


        // 2) Verify token 
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        req.jwtDecoded = decode;

        // 3) check if the user is exist (not deleted). But should be consider due performance issue.
        // const user = await User.findById(decode.id);
        // if (!user) {
        //     return next(new AppError(401, 'fail', 'This user is no longer exist'), req, res, next);
        // }
        // req.user = user;
        
        next();

    } catch (err) {
        return next(new AppError(401, 'failed', 'Token invalid, please login to continue!'), req, res, next);
    }
};