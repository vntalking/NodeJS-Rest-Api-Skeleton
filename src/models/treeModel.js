const dateUtils = require('../utils/dateUtils');
const database = require('../services/database.js');

async function getTreesByCode(tree_code, logInfo) {
    let query = `BEGIN
                    :ret := TREES_MANAGER.search_tree_detail(:p_tree_code, :p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_tree_code: tree_code.toUpperCase(),
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    result.forEach(tree => {
        if (tree.tree_media_url !== null) {
            let data = []
            let imgs = tree.tree_media_url.split("|");
            imgs.forEach(img => {
                data.push(process.env.DOMAIN + img);
            })
            tree.tree_media_url = data;
        }
    })

    return result;
}

async function searchMap(searchData){
    let query = `BEGIN
                    :ret := TREES_MANAGER.search_trees_on_map(:p_area_id, :p_tree_category_id, :p_persion_id, :p_date_from, :p_date_to, :p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_area_id: searchData.area_id,
        p_tree_category_id: searchData.tree_category_id,
        p_persion_id: searchData.persion_id,
        p_date_from: dateUtils.getDateFromTimestamp(searchData.date_from),
        p_date_to: dateUtils.getDateFromTimestamp(searchData.date_to),
        p_username: searchData.username,
        p_device: searchData.device,
        p_client: searchData.client
    });

    //make full url of thumbnail.
    result.forEach(tree => {
        if (tree.tree_media_url !== null) {
            tree.tree_media_url = process.env.DOMAIN + tree.tree_media_url
        }
    });

    return result;
}

async function search(searchData){
    let query = `BEGIN
                    :ret := TREES_MANAGER.search_trees(:p_tree_code, :p_tree_category_id, :p_persion_id, :p_area_id, :p_date_from, :p_date_to, :p_item_per_page, :p_page_index, :p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_tree_code: searchData.tree_code.toUpperCase() || "",
        p_tree_category_id: searchData.tree_category_id || -1,
        p_persion_id: searchData.persion_id || -1,
        p_area_id: searchData.area_id || -1,
        p_date_from: dateUtils.getDateFromTimestamp(searchData.date_from || ""),
        p_date_to: dateUtils.getDateFromTimestamp(searchData.date_to || ""),
        p_item_per_page: searchData.item_per_page || 10,
        p_page_index: searchData.page_index | 1,
        p_username: searchData.username,
        p_device: searchData.device,
        p_client: searchData.client
    });

    //make full url of thumbnail.
    result.forEach(tree => {
        if (tree.tree_media_url !== null) {
            tree.tree_media_url = process.env.DOMAIN + tree.tree_media_url
        }
    });

    return result;
}

async function searchAdvance(filter, logInfo) {
    let query = `BEGIN
                    :ret := REPORT_MANAGER.search_tree_advance(
                        :p_tree_code, 
                        :p_tree_category_id, 
                        :p_persion_id, 
                        :p_area_id, 
                        :p_place_id,
                        :p_created_user,
                        :p_forest_type_id,
                        :p_date_from, 
                        :p_date_to, 
                        :p_item_per_page, 
                        :p_page_index, 
                        :p_username, 
                        :p_device, 
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_tree_code: filter.tree_code ? filter.tree_code.toUpperCase() :  "",
        p_tree_category_id: filter.tree_category_id || -1,
        p_persion_id: filter.persion_id || -1,
        p_area_id: filter.area_id || -1,
        p_place_id: filter.place_id || -1,
        p_created_user: filter.created_user || -1,
        p_forest_type_id: filter.forest_type_id || -1,
        p_date_from: dateUtils.getDateFromTimestamp(filter.date_from || ""),
        p_date_to: dateUtils.getDateFromTimestamp(filter.date_to|| ""),
        p_item_per_page: filter.item_per_page || 10,
        p_page_index: filter.page_index || 1,
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    //make full url of thumbnail.
    result.forEach(tree => {
        if (tree.tree_media_url !== null) {
            tree.tree_media_url = process.env.DOMAIN + tree.tree_media_url
        }
    });

    // make QR code URL here
    result = result.map(tree=> ({ ...tree, urlQrCode: process.env.WEBAPP_URL + '/#/quick/search/'+tree.tree_code }))

    return result;
}

async function getNumberTreeWhenAdvanceSearch(filter) {
    let queryGetTotal = `BEGIN
                            :ret := REPORT_MANAGER.count_tree_advance(
                                :p_tree_code, 
                                :p_tree_category_id, 
                                :p_persion_id, 
                                :p_area_id, 
                                :p_place_id,
                                :p_created_user,
                                :p_forest_type_id,
                                :p_date_from, 
                                :p_date_to);
                        END;`

    let totalResults = await database.execute(queryGetTotal, {
        p_tree_code: filter.tree_code ? filter.tree_code.toUpperCase() :  "",
        p_tree_category_id: filter.tree_category_id || -1,
        p_persion_id: filter.persion_id || -1,
        p_area_id: filter.area_id || -1,
        p_place_id: filter.place_id || -1,
        p_created_user: filter.created_user || -1,
        p_forest_type_id: filter.forest_type_id || -1,
        p_date_from: dateUtils.getDateFromTimestamp(filter.date_from || ""),
        p_date_to: dateUtils.getDateFromTimestamp(filter.date_to|| "")
    });

    return totalResults;
}

async function getNumberTreeWhenSearch(searchData) {
    let query = `BEGIN
                    :ret := TREES_MANAGER.count_trees_total(:p_tree_code, :p_tree_category_id, :p_persion_id, :p_area_id, :p_date_from, :p_date_to);
                END;`

    let result = await database.execute(query, {
        p_tree_code: searchData.tree_code.toUpperCase(),
        p_tree_category_id: searchData.tree_category_id,
        p_persion_id: searchData.persion_id,
        p_area_id: searchData.area_id,
        p_date_from: dateUtils.getDateFromTimestamp(searchData.date_from),
        p_date_to: dateUtils.getDateFromTimestamp(searchData.date_to)
    });

    return result;
}

async function getTreeCategories(logInfo) {
    let query = `BEGIN
                    :ret := TREES_MANAGER.search_tree_categories(:p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

async function getTreeCategoriesFullData(logInfo) {
    let query = `BEGIN
                    :ret := TREE_CATEGORIES_MANAGER.getall_tree_categories(:p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

async function addTreeCategory(categoryInfo, logInfo) {
    let query = `BEGIN
                    :ret := TREE_CATEGORIES_MANAGER.insert_tree_categories(
                        :p_category_name,
                        :p_introduction,
                        :p_status,
                        :p_username, 
                        :p_device, 
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_category_name: categoryInfo.category_name,
        p_introduction: categoryInfo.introduction,
        p_status: categoryInfo.status,
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

async function updateTreeCategory(categoryInfo,logInfo) {
    let query = `BEGIN
                    :ret := TREE_CATEGORIES_MANAGER.update_tree_categories(
                        :p_id,
                        :p_category_name,
                        :p_introduction,
                        :p_status,
                        :p_username, 
                        :p_device, 
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_id: categoryInfo.id,
        p_category_name: categoryInfo.category_name,
        p_introduction: categoryInfo.introduction,
        p_status: categoryInfo.status,
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

async function removeTreeCategory(categoryInfo, logInfo) {
    let query = `BEGIN
                    :ret := TREE_CATEGORIES_MANAGER.delete_tree_categories(
                        :p_id,
                        :p_username, 
                        :p_device, 
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_id: categoryInfo.id,
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

async function getTreeCareHistoryByCode(treeCode, logInfo) {
    let query = `BEGIN
                    :ret := CARE_MANAGER.search_care_by_tree(:p_tree_id, :p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_tree_id: treeCode.toUpperCase(),
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

async function getTreeTypes(logInfo) {
    let query = `BEGIN
                    :ret := TREES_MANAGER.search_tree_types(:p_username, :p_device, :p_client);
                END;`

    let result = await database.execute(query, {
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

async function add(treeInfo, logInfo) {
    let query = `BEGIN
                    :ret := TREES_MANAGER.insert_tree(
                        :p_tree_name, 
                        :p_tree_code, 
                        :p_tree_date, 
                        :p_category_id, 
                        :p_infomation, 
                        :p_persion_created_id, 
                        :p_persion_created_fullname,
                        :p_area_id, 
                        :p_place_id, 
                        :p_lat_lng, 
                        :p_shadown_radius, 
                        :p_forest_type, 
                        :p_tree_total, 
                        :p_acreage, 
                        :p_organization_id, 
                        :p_list_persion_assigned, 
                        :p_list_media_id, 
                        :p_tree_note,
                        :p_tree_lo,
                        :p_tree_k,
                        :p_tree_tk,
                        :p_address_detail,
                        :p_username, 
                        :p_device, 
                        :p_client);
                END;`

        let result = await database.execute(query, {
            p_tree_name: treeInfo.tree_name,
            p_tree_code: treeInfo.tree_code,
            p_tree_date: dateUtils.getDateFromTimestamp(treeInfo.tree_date),
            p_category_id: treeInfo.category_id,
            p_infomation: treeInfo.infomation,
            p_persion_created_id: treeInfo.persion_created_id,
            p_persion_created_fullname: treeInfo.persion_created_fullname,
            p_area_id: treeInfo.area_id,
            p_place_id: treeInfo.place_id,
            p_lat_lng: treeInfo.lat_lng,
            p_shadown_radius: treeInfo.shadown_radius,
            p_forest_type: treeInfo.forest_type,
            p_tree_total: treeInfo.tree_total,
            p_acreage: treeInfo.acreage.toString().replace(",","."),
            p_organization_id: treeInfo.organization_id,
            p_list_persion_assigned: treeInfo.list_persion_assigned,
            p_list_media_id: treeInfo.list_media_id,
            p_tree_note : treeInfo.tree_note,
            p_tree_lo : treeInfo.tree_lo,
            p_tree_k : treeInfo.tree_k,
            p_tree_tk : treeInfo.tree_tk,
            p_address_detail : treeInfo.address_detail,
            p_username: logInfo.username,
            p_device: logInfo.device,
            p_client: logInfo.client
        });

        return result;
}

async function update(treeInfo, logInfo) {
    let query = `BEGIN
                    :ret := TREES_MANAGER.update_tree(
                        :p_tree_id,
                        :p_tree_name, 
                        :p_tree_code, 
                        :p_tree_date, 
                        :p_category_id, 
                        :p_infomation, 
                        :p_persion_created_id, 
                        :p_persion_created_fullname,
                        :p_area_id, 
                        :p_place_id, 
                        :p_lat_lng, 
                        :p_shadown_radius, 
                        :p_forest_type, 
                        :p_tree_total, 
                        :p_acreage, 
                        :p_organization_id, 
                        :p_list_persion_assigned, 
                        :p_list_media_id,
                        :p_tree_note,
                        :p_tree_lo,
                        :p_tree_k,
                        :p_tree_tk,
                        :p_address_detail,
                        :p_username, 
                        :p_device, 
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_tree_id: treeInfo.tree_id,
        p_tree_name: treeInfo.tree_name,
        p_tree_code: treeInfo.tree_code,
        p_tree_date: dateUtils.getDateFromTimestamp(treeInfo.tree_date),
        p_category_id: treeInfo.category_id,
        p_infomation: treeInfo.infomation,
        p_persion_created_id: treeInfo.persion_created_id,
        p_persion_created_fullname: treeInfo.persion_created_fullname,
        p_area_id: treeInfo.area_id,
        p_place_id: treeInfo.place_id,
        p_lat_lng: treeInfo.lat_lng,
        p_shadown_radius: treeInfo.shadown_radius,
        p_forest_type: treeInfo.forest_type,
        p_tree_total: treeInfo.tree_total,
        p_acreage: treeInfo.acreage.toString().replace(",","."),
        p_organization_id: treeInfo.organization_id,
        p_list_persion_assigned: treeInfo.list_persion_assigned,
        p_list_media_id: treeInfo.list_media_id,
        p_tree_note: treeInfo.tree_note,
        p_tree_lo: treeInfo.tree_lo,
        p_tree_k: treeInfo.tree_k,
        p_tree_tk: treeInfo.tree_tk,
        p_address_detail: treeInfo.address_detail,
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

async function remove(treeInfo, logInfo) {
    let query = `BEGIN
                    :ret := TREES_MANAGER.delete_tree(
                        :p_tree_id,
                        :p_username, 
                        :p_device, 
                        :p_client);
                END;`

    let result = await database.execute(query, {
        p_tree_id: treeInfo.tree_id,
        p_username: logInfo.username,
        p_device: logInfo.device,
        p_client: logInfo.client
    });

    return result;
}

module.exports = { 
    getTreesByCode, 
    searchMap,
    search, 
    getTreeCategories, 
    getTreeCareHistoryByCode,
    getTreeTypes,
    add,
    update,
    remove,
    getTreeCategoriesFullData,
    addTreeCategory,
    updateTreeCategory,
    removeTreeCategory,
    getNumberTreeWhenSearch,
    searchAdvance,
    getNumberTreeWhenAdvanceSearch
}