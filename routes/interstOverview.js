"use strict";
const express = require('express')
const interstDetails = require('./intrestDetails')
const router = express.Router()
const auth = require('./../backend/auth/authToken')
const db = require('../backend/data/db');
//send id to the next route, so yo can get the websites details
//router.use(require('./intrestDetails')); getPointsOfIntrestID
const parma = require('../backend/validators/validParmas');

router.route('/:interestType')
    .get(async (req, res) => {

        const intrest = await req.params.interestType;
        console.log(intrest)
        if (parma.checkIntrest(intrest)) {
            const data = await db.getPOITypes(intrest);
            res.send(`<h1> this should be intrest point ${req.params.interestType}   </h1> \n ${data}`)
        } else {
            res.status(401)
        }

    })
    .post(async (req, res) => { res.json({}); });

router.route('/:interestType/:id')
    .get(async (req, res) => {
        const intrest = await req.params.interestType;
        const id = await req.params.id;
        if (parma.checkIntrest(intrest)) {
            const data = await db.getPOIByID(id);
            res.send(`<h1> this should be details ${req.params.interestType}   </h1> \n ${data}`)
        } else {
            res.json({})
        }

    })
    .post(auth.requiredAdminLoggedIn, async (req, res) => {

        res.json({

        });
    });

module.exports = router;