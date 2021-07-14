

const userModel = require('../models/userModel');
const { body, validationResult } = require('express-validator');

// get information of a user
exports.getUser = async function(request, response, next) {
    const user_id = request.params.id;
    const logInfo = {
        username: request.jwtDecoded.userInfo.username,
        device: request.headers["device"] || 'Unknown',
        client: request.headers["client"] || 'Unknown',
    }
    const results = await userModel.getUserInfo(user_id, logInfo);
    next(results, request, response, next)
}

exports.updateUser = async function(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(200).json({ errors: errors.array() });
    }

    const logInfo = {
        username: request.jwtDecoded.userInfo.username,
        device: request.headers["device"] || 'Unknown',
        client: request.headers["client"] || 'Unknown',
    }

    const userInfo = {
        p_user_id,
        p_user_name,
        p_password,
        p_user_type,
        p_persion_id,
        p_avatar,
        p_status
    } = request.body

    const results = await userModel.update(userInfo, logInfo);

    next(results, request, response, next)
}

exports.getAccounts = async function(request, response, next) {
    const filter = {
        organization_id,
        persion_id
    } = request.query;

    const logInfo = {
        username: request.jwtDecoded.userInfo.username,
        device: request.headers["device"] || 'Unknown',
        client: request.headers["client"] || 'Unknown',
    }

    const results = await userModel.getAccounts(filter, logInfo);
    next(results, request, response, next)
}

exports.addAccount = async function(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(200).json({ errors: errors.array() });
    }

    const account = {
        p_user_name,
        p_password,
        p_user_type,
        p_persion_id,
        p_avatar,
        p_status
    } = request.body;

    const logInfo = {
        username: request.jwtDecoded.userInfo.username,
        device: request.headers["device"] || 'Unknown',
        client: request.headers["client"] || 'Unknown',
    }

    const results = await userModel.addAccount(account, logInfo);
    next(results, request, response, next);
}

exports.removeAccount = async function(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(200).json({ errors: errors.array() });
    }
    const account = {
        p_user_id
    } = request.body;

    const logInfo = {
        username: request.jwtDecoded.userInfo.username,
        device: request.headers["device"] || 'Unknown',
        client: request.headers["client"] || 'Unknown',
    }

    const results = await userModel.removeAccount(account, logInfo);
    next(results, request, response, next);
}

exports.validate = function (method) {
    switch (method) {
        case 'updateAccount': {
            return [
                body('p_user_id')
                    .exists().withMessage('Please provide p_user_id')
                    .isNumeric().withMessage('p_user_id must be of type Number.'),
            ]
        }

        case 'addAccount': {
            return [
                body('p_user_name')
                    .exists().withMessage('Please provide user_name'),
                body('p_password')
                    .exists().withMessage('Please provide password')
                    .isLength({ min: 6}).withMessage('password must be greater than 6')
            ]
        }
        case 'removeAccount': {
            return [
                body('p_user_id')
                    .exists().withMessage('Please provide id'),
            ]
        }
    }

}