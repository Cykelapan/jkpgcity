"use strict";
const express = require('express');
const router = express.Router();

const db = require('../backend/data/db');
const getDecodeToken = require('../backend/auth/getDecodedToken');

router.route('/')
    .get(async (req, res) => {
        const token = await getDecodeToken(req.headers.authorization);
        if (token) {
            const deleted = await db.removeToken(token);

        }

        res.status(200).json({});
    });


module.exports = router;