"use strict";
const express = require('express');
const router = express.Router();
const db = require('../backend/data/db');
const auth = require('../backend/auth/authToken');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
//CHECK THAT A USER IS LOGGED IN AND ACTIVE TO SEE THIS SITE
router.route('/')
    .get(async (req, res,) => {
        // vad skickas in?

        const data = await db.getPOIByID(ID)
        const userStores = [];
        res.status(200).json(userStores);
    })


    .post(async (req, res) => {
        //var finns posten?
        const newData = req.body
        console.log(newData);
        res.status(500).json({ newData })
        /*
        if (newData) {
            const id = newData._id.value
            const updated = await db.updatePOI(id, newData);
            res.status(200).json({ updated })
        } else {
            res.status(500).json({ error: 'Error updating POI' });
        }
        */
    })

    //var finns data till det som ska raderas?
    .delete(async (req, res) => {
        const id = req.body
        const isDeleted = await db.deletPOI(id);
        if (isDeleted) res.status(200).json({})
        else res.status(500).json({})
    });

module.exports = router;