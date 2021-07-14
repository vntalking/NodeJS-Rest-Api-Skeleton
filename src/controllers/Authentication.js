const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const AppError = require('../utils/appError');
const { body, validationResult } = require('express-validator');

const createToken = userInfo => {
    return jwt.sign({
        userInfo
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(200).json({ errors: errors.array() });
            return;
        }

        const userInfo = {
            username,
            password,
            gg_token
        } = req.body;

        // 1) check if email and password exist
        if (!username || !password) {
            return next(new AppError(404, 'failed', 'Please provide email or password'), req, res, next);
        }

        const logInfo = {
            device: req.headers["device"] || 'Unknown',
            client: req.headers["client"] || 'Unknown',
        }

        // 2) check if user exist and password is correct
        let result = await UserModel.login(userInfo, logInfo);
        if(result.length === 0 || (typeof result[0].error_code !== 'undefined' && result[0].error_code !== 0)){
            return res.status(200).json({
                status: 'failed',
                message: result[0] ? result[0].error_message : 'Login was failed with unknown reason.'
            });
        }

        const userData = {
            name: result[0].full_name,
            username: userInfo.username,
            role: result[0].user_type
        };

        // 3) All correct, send jwt to client
        const token = createToken(userData);

        // Remove the password from the output 
        userInfo.password = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data: userData
        });

    } catch (err) {
        next(err);
    }
};

exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(200).json({ errors: errors.array() });
            return;
        }
        //1) Validate user information after pre-process in middleware: username, password, email.
        const {
            username,
            password
        } = req.body;
        
        //2) Save to DB
        /* const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
        }); */
        const user = {
            _id: "1",
            name: "Admin",
            username: req.body.username
        };
        //3) Create token and send jwt to client
        const token = createToken(user);

        user.password = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data: user
        });

    } catch (err) {
        next(err);
    }

};

exports.validate = function (method) {
    switch (method) {
        case 'login': {
            return [
                body('username').exists().withMessage('Please provide userName'),
                body('password').exists().withMessage('Please provide password')
                    .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
            ]
        }
        case 'signup': {
            return [
                body('username').exists().withMessage('Please provide userName'),
                body('password').exists().withMessage('Please provide password')
                    .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
            ]
        }
    }
}