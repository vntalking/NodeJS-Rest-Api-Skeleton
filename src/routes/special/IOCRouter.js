const express = require('express');
const router = express.Router();

// GET /api/
router.get('/', (req, res, next)=> {
    res.status(200).json({
        msg: "Get special APIs"
    })
});

module.exports = router;