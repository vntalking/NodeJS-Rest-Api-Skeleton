//const jwt = require('jsonwebtoken');
const { userModel } = require('../../models');
const AppError = require('../../utils/appError');

const redis = require('redis');
const JWTR =  require('jwt-redis').default;

const redisClient = redis.createClient();
const jwtr = new JWTR(redisClient);

const { 
    LoginSchema 
} = require('./Validation');


const createToken =  async userInfo => {
    return await jwtr.sign({
        userInfo
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

};

exports.login = async (req, res, next) => {
    try {
        
        const userInfo = {
            username,
            password
        } = req.body;

        // 1) validate request body against schema. check if email and password exist
        const { error } = LoginSchema.validate(userInfo);
        if (error) {
            return next(new AppError(400, 'Bad Request', `Validation error: ${error.details.map(x => x.message).join(', ')}`), req, res, next);
        }

        const logInfo = {
            device: req.headers["device"] || 'Unknown',
            client: req.headers["client"] || 'Unknown',
        }

        // 2) check if user and password in Database
        let result = await userModel.login(userInfo, logInfo);
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

        //const userData = userInfo;

        // 3) All correct, send jwt to client
        const token = await createToken(userData);

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

exports.logout = async (req, res, next) => {
    // should delete token
    res.status(200).json({
        msg: 'Logout successed!'
    })
}

exports.signup = async (req, res, next) => {
    try {
        
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
