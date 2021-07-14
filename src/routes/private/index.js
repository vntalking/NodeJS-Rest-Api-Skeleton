const express = require('express');
var app = express();
const userRouter = require('./UserRouter');

app.use('/users', userRouter);

module.exports = app;