"use strict";
const express = require('express');
const router = express.Router();


//NEEDS TO BE ADMIN, create new stores, update and remove
//WHERE there is comments remove or add

router.route('/')
    .get(async (req, res,) => {
        const db = req.db;

        res.status(200).send('<h1> ADMIN PAGE </h1>');
    })
    .post(async (req, res) => { res.json({}); });

module.exports = router;