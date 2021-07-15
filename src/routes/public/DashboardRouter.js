const express = require('express');
const router = express.Router();

const apicache = require ('apicache');
const cache = apicache.options({ enabled: process.env.CACHE_ENABLE==='true' }).middleware(process.env.CACHE_EXPIRES_IN);

const {dashboard} = require('../../controllers');

// GET /api/dashboard
router.get('/', dashboard.getOne);

module.exports = router;