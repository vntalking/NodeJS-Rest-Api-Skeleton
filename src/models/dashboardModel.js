const {database} = require('../services');

async function getSumary(logInfo) {
    let query = `BEGIN
                    :ret := DASHBOARD_MANAGER.get_total_tree(:p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_username: logInfo.username || "",
        p_device: logInfo.device || "",
        p_client: logInfo.client || ""
    });
    return result;
}

module.exports = { 
    getSumary
}