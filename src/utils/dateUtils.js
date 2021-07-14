const dateConfig = require('../config/dateConfig');
const moment = require('moment');

function isValidTimestamp(_timestamp) {
    const newTimestamp = new Date(_timestamp).getTime();
    return isNumeric(newTimestamp);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getDateFromTimestamp(_timestamp) {
    if(_timestamp === '') return _timestamp;
    return moment.unix(_timestamp/1000).format(dateConfig.format);
}

function getCurrentTimestamp() {
    return new Date().getTime();
}

module.exports = {
    isValidTimestamp,
    getDateFromTimestamp,
    getCurrentTimestamp
}