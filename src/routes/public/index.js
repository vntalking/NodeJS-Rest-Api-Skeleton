const express = require('express');
var app = express();

// Import child routers
const dashboardRouter = require('./DashboardRouter');
const authRouter = require('./AuthRouter');

app.use('/dashboard', dashboardRouter);
app.use('/auth', authRouter);


module.exports = app;