const express = require('express');
const router = express.Router();
const {authentication} = require('../../controllers');

// POST /api/public/auth/login
router.post('/login', authentication.login);

// POST /api/public/auth/signup
router.post('/signup', authentication.signup);

module.exports = router;