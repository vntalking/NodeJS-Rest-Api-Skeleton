const database = require('../services/database.js');

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

async function update (userInfo, logInfo) {
    let query = `BEGIN
                    :ret := USER_MANAGER.update_user(
                        :p_user_id,
                        :p_user_name,
                        :p_password,
                        :p_user_type,
                        :p_persion_id,
                        :p_avatar,
                        :p_status,
                        :p_username,
                        :p_device, 
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_user_id: userInfo.p_user_id,
        p_user_name: userInfo.p_user_name,
        p_password: userInfo.p_password,
        p_user_type: userInfo.p_user_type,
        p_persion_id: userInfo.p_persion_id,
        p_avatar: userInfo.p_avatar,
        p_status: userInfo.p_status,
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

async function getAccounts(filter, logInfo) {
    let query = `BEGIN
                    :ret := USER_MANAGER.search_users(
                        :p_organization_id,
                        :p_persion_id,
                        :p_username,
                        :p_device, 
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_organization_id: filter.organization_id || 1,
        p_persion_id: filter.persion_id || 1,
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

async function addAccount(account, logInfo) {
    let query = `BEGIN
                    :ret := USER_MANAGER.insert_user(
                        :p_user_name,
                        :p_password,
                        :p_user_type,
                        :p_persion_id,
                        :p_avatar,
                        :p_status,
                        :p_username,
                        :p_device, 
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_user_name: account.p_user_name,
        p_password: account.p_password,
        p_user_type: account.p_user_type,
        p_persion_id: account.p_persion_id,
        p_avatar: account.p_avatar,
        p_status: account.p_status || 1,
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
    
}

async function removeAccount(account, logInfo) {
    let query = `BEGIN
                    :ret := USER_MANAGER.delete_user(
                        :p_user_id,
                        :p_username,
                        :p_device, 
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_user_id: account.p_user_id,
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

module.exports = { 
    login,
    update,
    getUserInfo,
    getAccounts,
    addAccount,
    removeAccount
 }