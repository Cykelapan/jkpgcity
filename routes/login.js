const express = require('express');
const router = express.Router();

router.route('/')
    .get(async (req, res,) => {
        const db = req.db;

        res.status(200).send('<h1> Discover </h1>')
    })
    .post(async (req, res) => {

    });

router.route('/register')
    .get(async (req, res) => {

    })
    .post(async (req, res) => {

    });


module.exports = router;