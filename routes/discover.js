"use strict";
const express = require('express');
const router = express.Router();


router.use(require('./interstOverview'));

router.get('/', async (req, res,) => {
    const db = req.db;

    res.status(200).send('<h1> Discover </h1>')
});


module.exports = router;
