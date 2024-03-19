"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const db = require('../backend/data/db');
const validData = require('../backend/validators/validPOIdata')
const decodeToken = require('../backend/auth/getDecodedToken');
const getToken = require('../backend/auth/getTokenRaw');
const updateToken = require('../backend/auth/updateToken');
const auth = require('../backend/auth/authToken');

router.use(bodyParser.json());

router.route('/')
    .get(async (req, res,) => {
        const token = await decodeToken(req.headers.authorization)
        
        if (!token.ownAStore) {
          return res.status(200).json([]);
        }
        
        const data = await db.getUserPOI(token.id)
        return res.status(200).json(data);
    })


    .post(async (req, res) => {
        const newData = req.body
        
        const data = await validData(newData)
        if (!data) {
            res.status(400).json({ error: 'Missing inputs' });
            return;
        }

        const token = await decodeToken(req.headers.authorization)
        const newObject = await db.createNewPOI(data, token.id)

        if (!newObject) {
            res.status(500).json({ error: 'Could not create new data' });
            return; // no return here??
        }

        if (token.isStoreOwner) {
            res.status(200).json({ newObject });
        } else {
            const oldT = await getToken(req.headers.authorization)
            await db.removeToken(oldT)
            const updatedToken = await updateToken(token, true);
            res
              .status(202)
              .setHeader('Authorization', `Bearer ${updatedToken}`)
              .json({})
        }
    })

    .delete(async (req, res) => {
        const { _id } = req.body
        
        if (_id) {
            const token = await decodeToken(req.headers.authorization)
            const isDeleted = await db.deletPOI(_id);
            await db.deleteStore(token.id, _id)
            if (isDeleted) res.status(200).json({})
            else res.status(500).json({})

        }
        else res.status(500).json({})
    });


module.exports = router;