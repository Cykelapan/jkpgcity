"use strict";
const express = require('express');
const router = express.Router();

// this is client side
router.route('/')
    .get(async (req, res) => {
        //how to clear jwt
        res.json({});
    });


module.exports = router;