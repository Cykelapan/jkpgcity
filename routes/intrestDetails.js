"use strict";
const express = require('express')
const router = express.Router()

router.route('/:id')
    .get(async (req, res) => { res.json({}); })
    .post(async (req, res) => { res.json({}); });


module.exports = router;