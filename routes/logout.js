"use strict";
const express = require('express');
const router = express.Router();

const db = require('../backend/data/db');
const getDecodeToken = require('../backend/auth/getDecodedToken');
const getToken = require('../backend/auth/getTokenRaw');

router.route('/')
    .get(async (req, res) => {
        const token = await getToken(req.headers.authorization);
        if (token) {
            const deleted = await db.removeToken(token);

        }

        res.status(200).json({});
    });


module.exports = router;