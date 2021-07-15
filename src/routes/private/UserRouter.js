const express = require('express');
const router = express.Router();
const apicache = require ('apicache');
const cache = apicache.options({ enabled: process.env.CACHE_ENABLE==='true' }).middleware(process.env.CACHE_EXPIRES_IN);

const { authentication, user } = require('../../controllers') ;

// GET /api/private/users
router.get('/', user.getUser);

// POST /api/private/users/logout
router.post('/logout', authentication.logout);

module.exports = router;