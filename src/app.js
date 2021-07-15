const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');


const globalErrHandler = require('./controllers/error/Error');
const AppError = require('./utils/appError');
const app = express();

// Allow Cross-Origin requests
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());
app.use(function(req, res, next) {
    if(req.method == 'GET') {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
});

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API 
const limiter = rateLimit({
    max: 15000,
    windowMs: 5 * 60 * 1000,
    message: {
        code: 429,
        status: "rejected",
        msg: 'Too Many Request from this IP, please try again in 5 minutes'}
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '15kb'
}));

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Declare upload folder
app.use(express.static('public'));

/**
 * Routes
 */
const api = require('./routes/api');
app.use('/api/', api);

// The API for check server status
app.use('/', function(request, response) {
    response.status(200).json({
        status: "Success",
        message: "The API Server is running!"
    })
})

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'failed', 'Sorry! Route không tồn tại');
    next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;