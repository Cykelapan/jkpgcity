"use strict";
const express = require('express');
const router = express.Router();
const auth = require('../auth/authToken');

//CHECK THAT A USER IS LOGGED IN AND ACTIVE TO SEE THIS SITE
router.route('/')
    .get(async (req, res,) => {
        const db = req.db;

        res.status(200).send('<h1> USER PAGE </h1>');
    })
    .post(async (req, res) => { res.json({}); });

router.route('/settings')
    .get(async (req, res) => {
        res.status(200).send('<h1> USER SETTINGS PAGE </h1>');
    })
    .post(async (req, res) => { res.json({}); });


module.exports = router;