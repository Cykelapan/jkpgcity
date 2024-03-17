"use strict";
const express = require('express')
const interstDetails = require('./intrestDetails')
const router = express.Router()
const auth = require('./../backend/auth/authToken')

//send id to the next route, so yo can get the websites details
//router.use(require('./intrestDetails')); getPointsOfIntrestID

router.route('/:interestType')
    .get(async (req, res) => {
        const db = req.db;
        const t = await req.params.interestType;
        console.log(t);
        data = await db.getPOITypes(t);
        res.send(`<h1> this should be intrest point ${req.params.interestType}   </h1> \n ${data}`)
    })
    .post(async (req, res) => { res.json({}); });

router.route('/:interestType/:id')
    .get(async (req, res) => {
        const db = req.db;
        const t = req.params.id;
        console.log(t);
        data = await db.getPointsOfIntrestID(t);
        res.send(`<h1> this should be details ${req.params.interestType}   </h1> \n ${data}`)
    })
    .post(auth.requiredAdminLoggedIn, async (req, res) => {

        res.json({

        });
    });

module.exports = router;