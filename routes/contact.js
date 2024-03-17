"use strict";
const express = require('express');

const router = express.Router();

router.route('/')
    .get(async (req, res,) => {
        const db = req.db;

        res.status(200).send('<h1> CONTACT PAGE </h1>');
    })
    .post(async (req, res) => { res.json({}); });



module.exports = router;