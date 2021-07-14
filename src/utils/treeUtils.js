var urlUtils = require("url");
var path = require("path");
const treeType = require('../constants/treeType');

/**
 * validate URL of Tree is valid or not.
 * Example: URL valid: http://smarttrees.thainguyen.gov.vn/atk/atk016.html
 * @param {string} url 
 * @returns: boolean. 
 */
function validateTreeURL(url) {

    if(typeof url === 'undefined' || url === ''){
        return false;
    }

    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
}

/**
 * Because client can use any app scan QR code, so client shoulds send URL instead of Tree Code.
 * this function will extract TreeCode from URL
 * @param {string} url 
 */
function extractTreeCodeFromURL(url) {
    let treeCode = "";
    let parsed = urlUtils.parse(url);
    let filename = path.parse(path.basename(parsed.pathname)).name;
    
    // Process special case (vietnamese)
    filename = filename.replace('dothi', 'đt');
    
    treeCode = filename.toUpperCase();
    return treeCode;
}

/**
 * Check the type plant of tree
 *  - Cây trồng phân tán
 *  - Cây trồng tập trung
 * @param {} types 
 * @param {*} value 
 * @returns 
 */
function checkPlantTreeType(types = [], value) {
    return types.some(item => item == value)
}

function getSummaryAmountTree(data) {
    let dothi = data.filter(x => checkPlantTreeType(treeType.DO_THI, x.forest_type)).length;
    let nongthon = data.filter(x => checkPlantTreeType(treeType.NONG_THON, x.forest_type)).length;
    let taptrung = data.filter(x => checkPlantTreeType(treeType.TAP_TRUNG, x.forest_type))
                    .reduce((accumulator, currentValue) => accumulator + numOr0(currentValue.tree_total), 0);
    let rungphongho = data.filter(x => checkPlantTreeType(treeType.RUNG_PHONG_HO, x.forest_type))
                    .reduce((accumulator, currentValue) => accumulator + numOr0(currentValue.tree_total), 0);

    return {
        dothi: dothi,
        nongthon: nongthon,
        taptrung: taptrung,
        rungphongho: rungphongho
    };
}

function getSummaryAcreageTree(data) {
    let dothi = data.filter(x => checkPlantTreeType(treeType.DO_THI, x.forest_type))
                    .reduce((accumulator, currentValue) => accumulator + numOr0(currentValue.acreage), 0);
    let nongthon = data.filter(x => checkPlantTreeType(treeType.NONG_THON, x.forest_type))
                .reduce((accumulator, currentValue) => accumulator + numOr0(currentValue.acreage), 0);
    let taptrung = data.filter(x => checkPlantTreeType(treeType.TAP_TRUNG, x.forest_type))
                .reduce((accumulator, currentValue) => accumulator + numOr0(currentValue.acreage), 0);
    let rungphongho = data.filter(x => checkPlantTreeType(treeType.RUNG_PHONG_HO, x.forest_type))
                .reduce((accumulator, currentValue) => accumulator + numOr0(currentValue.acreage), 0);
    
    return {
        dothi: dothi,
        nongthon: nongthon,
        taptrung: taptrung,
        rungphongho: rungphongho
    };                

}

let numOr0 = n => n === null  ? 0 : n

module.exports = {
    validateTreeURL, 
    extractTreeCodeFromURL,
    getSummaryAmountTree,
    getSummaryAcreageTree
}