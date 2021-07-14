const database = require('../services/database.js');

async function getSumary(logInfo) {
    let query = `BEGIN
                    :ret := DASHBOARD_MANAGER.get_total_tree(:p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });
    return result;
}

async function getCategory(logInfo) {
    let query = `BEGIN
                    :ret := DASHBOARD_MANAGER.synthesized_tree_category(:p_username, :p_device, :p_client);
                END;`

    const result = await database.execute(query, {
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });
    return result;
}

async function getLocation(logInfo) {
    let query = `BEGIN
                    :ret := DASHBOARD_MANAGER.statistics_complete_plan(:p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });
    return result;
}

async function getMonth(logInfo) {
    let query = `BEGIN
                    :ret := DASHBOARD_MANAGER.statistics_new_tree(:p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });
    return result;
}

async function getMost(logInfo) {
    let query = `BEGIN
                    :ret := DASHBOARD_MANAGER.most_planter(:p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });
    return result;
}

async function getForestTypeAnalysis(logInfo) {
    let query = `BEGIN
                :ret := DASHBOARD_MANAGER.synthesized_tree_forest_type(:p_username, :p_device, :p_client);
            END;`

    let result = await database.execute(query, {
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });
    return result;
}

async function getTreeAcreageAnalysis(logInfo) {
    let query = `BEGIN
                    :ret := DASHBOARD_MANAGER.cal_tree_acreage(:p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });
    return result;
}

module.exports = { 
    getSumary, 
    getCategory,
    getLocation,
    getMonth,
    getMost,
    getForestTypeAnalysis,
    getTreeAcreageAnalysis
}