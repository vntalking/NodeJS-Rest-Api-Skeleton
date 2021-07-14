const express = require('express');
var app = express();
const dashboardRouter = require('./DashboardRouter');

app.use('/dashboard', dashboardRouter);
module.exports = app;