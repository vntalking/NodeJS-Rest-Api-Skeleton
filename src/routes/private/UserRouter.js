const express = require('express');
const router = express.Router();
const apicache = require ('apicache');
const cache = apicache.options({ enabled: process.env.CACHE_ENABLE==='true' }).middleware(process.env.CACHE_EXPIRES_IN);

router.get('/', (req, res, next)=> {
    res.status(200).json({
        msg: "get Users"
    })
})

// // POST /api/users/login
// router.post('/login', authController.validate('login'), authController.login);

// // POST /api/users/signup
// router.post('/signup', authController.validate('signup'), authController.signup);

// Protect all routes after this middleware
//router.use(auth.protect);
// GET /api/users/search


//process response format before send to client.
//router.use(responseMiddleware.processResponse);

// Only admin have permission to access for the below APIs 
//router.use(authController.restrictTo('admin'));

module.exports = router;