const statusCode = require('../constants/statusCode');
const statusMessage = require('../constants/statusMessage');
const errorMessage = require('../constants/errorMessage');
const apicache = require ('apicache');

/**
 * Process format of response before send it to client.
 * Handle clear cache here.
 * @param {*} results data which get from controller.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.format = async (results, req, res) => {

    if(!Array.isArray(results)) {
        // use this case when middleware return  next(new AppError(...)))
        return res.status(results.statusCode).json({...results, message: results.message});
    }
    
    if(results.length === 0)  {
        res.status(statusCode.SUCCESS).json({
            status: statusMessage.FAILED,
            data: [],
            message: req.error_message || errorMessage.NO_DATA
        })
    } else if((results[0].error_code !== undefined) && (results[0].error_code !== 0)){
        res.status(statusCode.SUCCESS).json({
            status: statusMessage.FAILED,
            data: [],
            message: results[0].error_message
        })
    } else {
        if(req.method != 'GET') {
            apicache.clear();
            console.log('Clear cache!')
        }
        res.status(statusCode.SUCCESS).json({
            status: statusMessage.SUCCESS,
            data: results,           
            message: null
        })
    }
}