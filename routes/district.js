"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const db = require('../backend/data/db');
const check = require('../backend/validators/validParmas');
const auth = require('../backend/auth/authToken.js');
const decodeToken = require('../backend/auth/getDecodedToken');


router.use(bodyParser.json());

router.get("/", async (req, res) => {
  const data = await db.getAllDirstrict();
  res.status(200).json(data);
});

router.post("/", auth.requiredAdminLoggedIn, async (req, res) => {
  // safe route
  res.json({ ok: true });
});

router.delete("/", auth.requiredAdminLoggedIn, async (req, res) => {
  const { _id } = req.body
  
  
  if (_id) {
      const token = await decodeToken(req.headers.authorization)
      const isDeleted = await db.deletPOI(_id);
      await db.deleteStore(token.id, _id)
      if (isDeleted) res.status(200).json({ ok: true })
      else res.status(500).json({ ok: false })
  }
  else {
    res.status(500).json({ ok: false })
  }
});


router.route('/:district')
  .get(async (req, res) => {
    const districtName = req.params.district
    console.log(districtName)
    if (check.checkDistrict(districtName)) {
      const data = await db.getPOIDistrict(districtName);

      res.status(200).json(data)

    } else {
      res.status(404).json({});
    }
  })
  .post(async (req, res) => {

  });


module.exports = router;