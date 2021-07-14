const statusCode = require('../constants/statusCode');
const statusMessage = require('../constants/statusMessage');
const errorMessage = require('../constants/errorMessage');
const treeModel = require('../models/treeModel');
const treeUtils = require('../utils/treeUtils');
const { body, validationResult } = require('express-validator');
const apicache = require ('apicache');

exports.getOne = async function (request, response, next) {
    const treeCode = request.params.tree_code || "";

    let results = await treeModel.getTreesByCode(treeCode, request.logInfo);
    results = results.map(tree=> ({ ...tree, urlQrCode: process.env.WEBAPP_URL + '/#/quick/search/'+tree.tree_code }))

    //check no data, error, success 
    next(results, request, response, next);

}

exports.getAll = async function (request, response) {
    response.status(statusCode.NOT_FOUND).json({
        status: statusMessage.FAILED,
        data: null,
        message: "Not yet implement"
    })

}

exports.searchMap = async function(request, response, next) {    
    const searchData = {       
        area_id: request.query.area_id || -1,
        tree_category_id: request.query.tree_category_id || -1,
        persion_id: request.query.persion_id || -1,        
        date_from: request.query.date_from || "",
        date_to: request.query.date_to || "",       
        ...request.logInfo

    }   
    let results = await treeModel.searchMap(searchData);
    results = results.map(tree=> ({ ...tree, urlQrCode: process.env.WEBAPP_URL + '/#/quick/search/'+tree.tree_code }))
    //check no data, error, success 
    next(results, request, response, next);
}

exports.search = async function(request, response) {
    const page = request.query.page_index  || 1;
    const searchData = {
        tree_code: request.query.tree_code || "",
        tree_category_id: request.query.tree_category_id || -1,
        persion_id: request.query.persion_id || -1,
        area_id: request.query.area_id || -1,
        date_from: request.query.date_from || "",
        date_to: request.query.date_to || "",
        item_per_page: request.query.item_per_page || 10,
        page_index: page,
        ...request.logInfo

    }

    let results = await treeModel.search(searchData);
    //check no data, error, success 
    if(results.length === 0)  {
        response.status(statusCode.SUCCESS).json({
            status: statusMessage.FAILED,
            data: [],
            message: errorMessage.NO_DATA
        })
    } else if((results[0].error_code !== undefined) && (results[0].error_code !== 0)){
        response.status(statusCode.SUCCESS).json({
            status: statusMessage.FAILED,
            data: [],
            message: results[0].error_message
        })
    } else {
        results = results.map(tree=> ({ ...tree, urlQrCode: process.env.WEBAPP_URL + '/#/quick/search/'+tree.tree_code }))
        response.status(statusCode.SUCCESS).json({
            status: statusMessage.SUCCESS,
            data: results,  
            page: page,         
            message: null
        })
    }
}

exports.getOnlyNumberTreeOnSearch = async function(request, response, next) {
    const searchData = {
        tree_code: request.query.tree_code || "",
        tree_category_id: request.query.tree_category_id || -1,
        persion_id: request.query.persion_id || -1,
        area_id: request.query.area_id || -1,
        date_from: request.query.date_from || "",
        date_to: request.query.date_to || "",
    }

    let results = await treeModel.getNumberTreeWhenSearch(searchData);
    next(results, request, response, next);
}

exports.getCategories = async function(request, response, next) {

    const results = await treeModel.getTreeCategories(request.logInfo);
    next(results, request, response, next)
}

exports.getCategoriesFullData = async function(request, response, next) {

    const results = await treeModel.getTreeCategoriesFullData(request.logInfo);
    next(results, request, response, next)
}

exports.addCategory = async function(request, response, next) {
    const categoryInfo = {
        category_name,
        introduction,
        status,
    } = request.body

    const results = await treeModel.addTreeCategory(categoryInfo, request.logInfo);
    next(results, request, response, next)
}

exports.updateCategory = async function(request, response, next) {
    const categoryInfo = {
        id,
        category_name,
        introduction,
        status,
    } = request.body

    const results = await treeModel.updateTreeCategory(categoryInfo, request.logInfo);
    next(results, request, response, next)
}

exports.deleteCategory = async function(request, response, next) {
    const categoryInfo = {
        id
    } = request.body

    const results = await treeModel.removeTreeCategory(categoryInfo, request.logInfo);
    next(results, request, response, next)
}

exports.getCareHistory = async function(request, response, next) {
    const treeCode = request.params.tree_code || "";

    const results = await treeModel.getTreeCareHistoryByCode(treeCode, request.logInfo);
    next(results, request, response, next)
}

exports.checkExist = async function (request, response) {
    const treeCode = request.query.tree_code;
    let trees = await treeModel.getTreesByCode(treeCode, request.logInfo);

    response.status(statusCode.SUCCESS).json({
        status: statusMessage.SUCCESS,
        exist: (trees.length !== 0),
        tree_id: trees.length !== 0 ? trees[0].tree_id : null
    })
    
}

exports.getCodeFromUrl = async function(request, response) {
    const url = request.query.url;
    // validate URL is valid or not.
    const isUrlValid = treeUtils.validateTreeURL(url);
    if(!isUrlValid) {
        return response.status(statusCode.SUCCESS).json({
            status: statusMessage.FAILED,
            tree_code: null,
            message: errorMessage.INVALID_URL
        })
    }

    // get tree_id and tree_code from DB
    let trees = await treeModel.getTreesByCode(url, request.logInfo);

    let treeId;
    if(trees.length !== 0) {
        treeId = trees[0].tree_id;
        treeCode = trees[0].tree_code;
    }else {
        treeId = null;
        treeCode = "";
    }

    response.status(statusCode.SUCCESS).json({
        status: statusMessage.SUCCESS,
        tree_code: treeCode,
        tree_id: treeId
    })
}

exports.getTypes = async function(request, response, next) {
    // get tree_id and tree_code from DB
    let results = await treeModel.getTreeTypes(request.logInfo);    
    next(results, request, response, next)
}

/**
 * Add a tree to DB
 * @param {} request 
 * @param {*} response 
 */
exports.add = async function(request, response) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(200).json({ errors: errors.array() });
    }

    const treeInfo = {
        tree_name,
        tree_code,
        tree_date,
        category_id,
        infomation,
        persion_created_id,
        persion_created_fullname,
        area_id,
        place_id,
        lat_lng,
        shadown_radius,
        forest_type,
        tree_total,
        acreage,
        organization_id,
        list_persion_assigned,
        list_media_id,
        tree_note,
        tree_lo,
        tree_k,
        tree_tk,
        address_detail
    } = request.body;

    //treat
    treeInfo.acreage = treeInfo.acreage || "0"

    const result = await treeModel.add(treeInfo, request.logInfo);
    if(result.length === 0 || result[0].error_code !== 0){
        response.status(statusCode.SUCCESS).json({
            status: statusMessage.FAILED,
            message: result.length != 0 ? result[0].error_message : errorMessage.ADD_FAILED
        })
    } else {
        apicache.clear();
        response.status(statusCode.SUCCESS).json({
            status: statusMessage.SUCCESS,
            data: result,
            message: null,
            url: process.env.WEBAPP_URL + '/#/quick/search/'+ result[0].data
        })
    }
    
}

/**
 * Update information of tree to DB
 * @param {} request 
 * @param {*} response 
 */
 exports.update = async function(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(200).json({ errors: errors.array() });
    }

    const treeInfo = {
        tree_id,
        tree_name,
        tree_code,
        tree_date,
        category_id,
        infomation,
        persion_created_id,
        persion_created_fullname,
        area_id,
        place_id,
        lat_lng,
        shadown_radius,
        forest_type,
        tree_total,
        acreage,
        organization_id,
        list_persion_assigned,
        list_media_id,
        tree_note,
        tree_lo,
        tree_k,
        tree_tk,
        address_detail
    } = request.body;

    treeInfo.acreage = treeInfo.acreage || "0"

    const result = await treeModel.update(treeInfo, request.logInfo);
    next(result, request, response, next)
    
}

/**
 * Delete a tree to DB. (change status 1 -> 2)
 * @param {} request 
 * @param {*} response 
 */
 exports.delete = async function(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(200).json({ errors: errors.array() });
    }

    const treeInfo = {
        tree_id,
    } = request.body;

    const result = await treeModel.remove(treeInfo, request.logInfo);
    next(result, request, response, next)
}

exports.validate = function (method) {
    switch (method) {
        case 'add': {
            return [
                body('tree_date')
                    .exists().withMessage('Please provide tree_date'),
                body('category_id')
                    .exists().withMessage('Please provide category_id')
                    .isNumeric().withMessage('category_id must be of type Number.'),
                body('area_id')
                    .exists().withMessage('Please provide area_id')
                    .isNumeric().withMessage('area_id must be of type Number.'),
                body('forest_type')
                    .exists().withMessage('Please provide forest_type')
                    .isNumeric().withMessage('forest_type must be of type Number.')
            ]
        }
        case 'update': {
            return [
                body('tree_id')
                    .exists().withMessage('Please provide tree_id')
                    .not().isEmpty().withMessage('tree_id can not be empty')
                    .isNumeric().withMessage('tree_id must be of type number.'),
                body('tree_date')
                    .exists().withMessage('Please provide tree_date'),
                body('category_id')
                    .exists().withMessage('Please provide category_id')
                    .isNumeric().withMessage('category_id must be of type Number.'),
                body('area_id')
                    .exists().withMessage('Please provide area_id')
                    .isNumeric().withMessage('area_id must be of type Number.'),
                body('forest_type')
                    .exists().withMessage('Please provide forest_type')
                    .isNumeric().withMessage('forest_type must be of type Number.')
            ]
        }
        case 'delete': {
            return [
                body('tree_id')
                    .exists().withMessage('Please provide tree_id')
                    .isNumeric().withMessage('tree_id must be of type number.'),
            ]
        }
        
    }
}