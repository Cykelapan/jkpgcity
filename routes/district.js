"use strict";
const path = require('node:path');

const express = require('express');
const router = express.Router();

const google_data = require(
  path.join(
    __dirname, "..backend/data/JSON", "./api_google_allData1.json"
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

const groupedByDistrict = groupByDistricts()

router.route('/')
  .get(async (req, res,) => {
    //const db = req.db;
    res.status(200).json(groupedByDistrict);
  })
  .post(async (req, res) => {

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