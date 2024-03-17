"use strict";
const path = require('node:path');

const express = require('express');
const router = express.Router();

const auth = require('../backend/auth/authToken.js');

const google_data = require(
  path.join(
    __dirname, "../backend/data/JSON", "./api_google_allData1.json"
  )
);

function groupByDistricts() {
  const collection = new Map()

  for (let place of google_data) {
    if (collection.has(place.district)) {
      collection.get(place.district).push(place)
      continue;
    }

    collection.set(place.district, [place])
  }
  // convert Map => Object
  return Object.fromEntries(collection)
}

const groupedByDistrict = groupByDistricts();

router.get("/", async (req, res) => {
  //const db = req.db;
  let disctrictNames = [];
  for (let district in groupedByDistrict) {
    disctrictNames.push(district);
  }
  
  res.status(200).json(disctrictNames);
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


router.route('/:districtID')
  .get(async (req, res) => {
    //const db = req.db;
    const districtID = req.params.districtID

    res.status(200).json(groupedByDistrict[districtID] ?? {})
  })
  .post(async (req, res) => {

  });


module.exports = router;