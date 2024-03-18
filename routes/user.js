"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const db = require('../backend/data/db');
const validData = require('../backend/validators/validPOIdata')
const decodeToken = require('../backend/auth/getDecodedToken');
const updateToken = require('../backend/auth/updateToken');
const auth = require('../backend/auth/authToken');

router.use(bodyParser.json());

router.route('/')
    .get(async (req, res,) => {
        const token = await decodeToken(req.headers.authorization)
        
        if (!token.ownAStore) {
          return res.status(200).json([]);
        }
        
        const data = await db.getUserPOI(token._id)
        return res.status(200).json(data);
    })


    .post(async (req, res) => {
        const newData = req.body
        
        const data = await validData(newData)
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
        await db.deleteStore(token.id, _id)
        
        res.status(isDeleted ? 200 : 500).json({})
    });

module.exports = router;