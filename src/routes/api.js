const express = require('express');
const app = express();

const publicApi = require('./public');
const privateApi = require('./private');
const specialApi = require('./special');
const {restrictTo} = require('./special/Restrict');

const responseMiddleware = require('../middleware/ResponseMiddleware');
const logInfoMiddleware = require('../middleware/LogInfoMiddleware');
const auth = require('../middleware/TokenMiddleware');

//get request information  to tracking
app.use(logInfoMiddleware.processLogInfo);

// Define public APIs, Any client can invoke these without authentication
app.use('/public', publicApi);

// Client need to authenticate before invoke these APIs.
app.use(auth.protect);
app.use('/private', privateApi);

// Special APIs, with authentication Users and Only Admin or something like this (ex: the APIs for 3rd App) can access the below APIs.
app.use(restrictTo('admin'));
app.use('/special', specialApi);

app.use(responseMiddleware.format);

module.exports = app;