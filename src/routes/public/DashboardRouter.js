const express = require('express');
const router = express.Router();

const apicache = require ('apicache');
const cache = apicache.options({ enabled: process.env.CACHE_ENABLE==='true' }).middleware(process.env.CACHE_EXPIRES_IN);

// GET /api/dashboard
router.get('/', cache, (req, res, next)=> {
    res.status(200).json({
        msg: "Get dashboard"
    })
});


module.exports = router;