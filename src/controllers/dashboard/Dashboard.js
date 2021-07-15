
const { dashboardModel } = require('../../models');

exports.getOne = async function (req, res, next) {

    const logInfo = {
        username: "admin",
        device: "Device",
        client: "Postman"
    }
    let results = await dashboardModel.getSumary(logInfo);

    next(results, req, res, next);
}
