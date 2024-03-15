"use strict";
const express = require('express');
const router = express.Router();

router.route('/')
    .get(async (req, res,) => {
        const db = req.db;

        res.status(200).send('<h1> PAGE DISTRICT </h1>');
    })
    .post(async (req, res) => {

    });

router.route('/:districtID')
    .get(async (req, res) => {
        const db = req.db;
        db.
            res.status(200).send('<h1> DISTICT ID </h1>');

    })
    .post(async (req, res) => {

    });


module.exports = router;