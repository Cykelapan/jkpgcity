"use strict";
const express = require('express');
const router = express.Router();
const db = require('../backend/data/db');
const auth = require('../backend/auth/authToken');
const validData = require('../backend/validators/validPOIdata')
const bodyParser = require('body-parser');
const decodeToken = require('../backend/auth/getDecodedToken');
const updateToken = require('../backend/auth/updateToken');
router.use(bodyParser.json());



router.route('/')
    .get(async (req, res,) => {
        const userStores = [];
        const token = await decodeToken(req.headers.authorization)
        if (token.ownAStore) {
            const data = await db.getUserPOI(token._id)
            res.status(200).json(data);
        } else {
            res.status(200).json(userStores);
        }
    })


    .post(async (req, res) => {
        const newData = req.body
        console.log(newData)
        // res.status(500).json({ error: 'Could not create new data' });
        
        const data = validData(newData)
        if (!data) {
          res.status(500).json({ error: 'Missing inputs' });
          return;
        }
        
        const token = await decodeToken(req.headers.authorization)
        const newObject = await db.createNewPOI(data, token.id)
        
        if (newObject) {
          res.status(500).json({ error: 'Could not create new data' });
          return;
        }
        
        const updatedToken = await updateToken(token, true);
        res.status(201)
          .header('Authorization', `Bearer ${updatedToken}`)
          .json({ newObject });
    })

    .delete(async (req, res) => {
        const { _id } = req.body
        const token = await decodeToken(req.headers.authorization)
        const isDeleted = await db.deletPOI(_id);
        await db.deleteStore(token._id, _id)
        if (isDeleted) res.status(200).json({})
        else res.status(500).json({})
    });

module.exports = router;