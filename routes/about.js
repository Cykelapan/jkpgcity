"use strict";
const express = require('express');
const router = express.Router();

router.route('/')
    .get(async (req, res,) => {
        const db = req.db;

        res.status(200).json({ description: "ABOUT PAGE" });
    })
    .post(async (req, res) => { res.json({}); });



module.exports = router;