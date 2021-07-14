const fs = require('fs-extra')
/**
 * Change all keys of object to lower string.
 * @param obj 
 */
function convertKeyObjectToLower(obj) {
    var key, keys = Object.keys(obj);
    var n = keys.length;
    var newobj={}
    let i = 0;
    while (i < n) {
      key = keys[i];
      newobj[key.toLowerCase()] = obj[key];
      i++;
    }

    return newobj;
}

/**
 * Get array data from cursor
 * @param {*} resultSet 
 */
async function extractArrayDataFromRs(resultSet) {
  let row;
  let data = [];
  while ((row = await resultSet.getRow())) {
      let item = convertKeyObjectToLower(row);
      data.push(item);
  }
  return data;
}

/**
 * get array images from string.
 * TBD
 * @param {*} imagesString 
 */
async function extractArrayImageFromString(imagesString) {
  let images = []
  images = imagesString.split("|");
  return images;
}

/**
 * Convert Linux URL to URI.
 * @param {*} str 
 * @returns 
 */

function fileUrl(str) {
  if (typeof str !== 'string') {
      throw new Error('Expected a string');
  }

  var pathName = str.replace(/\\/g, '/').replace('public','');
  return pathName;
};

async function moveFiles (oldfolder, newfolder) {
  try {
    await fs.move(oldfolder, newfolder)
  } catch (err) {
    console.error(err)
  }
}

function createUploadFolder() {
  let path = './public/images/';
  var dateObj = new Date();
  var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
  var year = dateObj.getUTCFullYear();
  try {
    fs.ensureDirSync('./public/images/'+ year);
    fs.ensureDirSync('./public/images/'+ year + "/" + month);
    path = './public/images/'+ year + "/" + month;
  } catch (err) {
    console.error(err)
  }

  return path;
}

function createUniqueFilename(filename) {
  return Date.now() + "_" + filename;
}

module.exports = {
  convertKeyObjectToLower, 
  extractArrayDataFromRs, 
  extractArrayImageFromString,
  fileUrl,
  createUploadFolder,
  createUniqueFilename
}