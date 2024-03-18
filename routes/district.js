"use strict";
const express = require('express');
const router = express.Router();
const db = require('../backend/data/db');
const check = require('../backend/validators/validParmas');
const auth = require('../backend/auth/authToken.js');

router.get("/", async (req, res) => {
  const data = await db.getAllDirstrict();
  res.status(200).json(data);
});

router.post("/", auth.requiredAdminLoggedIn, async (req, res) => {
  // safe route
  res.json({ ok: true });
});

router.delete("/", auth.requiredAdminLoggedIn, async (req, res) => {
  // safe route

  console.log(req);

  res.json({ ok: true });
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