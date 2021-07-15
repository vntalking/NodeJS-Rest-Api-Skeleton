const {
    database
} = require('../services');

async function login(userInfo, logInfo) {
    let query = `BEGIN
                    :ret := USER_MANAGER.login(
                        :p_username,
                        :p_password, 
                        :p_device, 
                        :p_client,
                        :p_gg_token);
                END;`

    let result = await database.execute(query, {
        p_username: userInfo.username,
        p_password: userInfo.password,
        p_device: logInfo.device,
        p_client: logInfo.client,
        p_gg_token:userInfo.gg_token || ''
    });

    return result;
}

async function getUserInfo(username, logInfo) {
    let query = `BEGIN
                    :ret := USER_MANAGER.get_user(
                        :p_un,
                        :p_username,
                        :p_device,
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_un: username,
        p_username: username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}


module.exports = { 
    login,
    getUserInfo,
 }