const express = require('express');
const app = express();
const IOCRouter = require('./IOCRouter');

app.use('/ioc', IOCRouter);

module.exports = app;