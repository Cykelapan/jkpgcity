"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const validateRegister = require('../validators/register');
const validateLogin = require('../validators/login');
const jwt = require('../auth/createToken');
const router = express.Router();
const cookie = require('../auth/cookies');

router.use(bodyParser.json());


router.route('/')
    .get(async (req, res,) => {
        const db = req.db;

        res.status(200).send('<h1> Login PAGE </h1>');
    })

    .post(async (req, res) => {

        const validate = await validateLogin(req.body);
        if (validate.haveErrors) { res.status(406).send("not vaild login crededitals"); }
        else {
            try {
                const db = req.db;
                const user = await db.getUserLogin(validate.validData.username, validate.validData.password);
                const token = await jwt.createToken(user);
                if (user && token) {

                    res.setHeader('Authorization', `Bearer ${token}`);
                    res.status(200).json(`${user.username} is logged on`);
                }


            } catch (error) {
                res.status(401).json({ error: error.messages });
            }
        }
    });




router.route('/register')
    .get(async (req, res) => {

        res.status(200).send('<h1> REGISTER PAGE </h1>');

    })
    .post(async (req, res) => {
        const validate = await validateRegister(req.body);
        console.log(validate.haveErrors)
        if (validate.haveErrors) {
            console.log(validate.errors);
            res.status(200).json({ error: validate.errors })
        } else {
            const db = req.db;
            const checkDB = await db.checkUsernameAndEmail(validate.validData.username, validate.validData.email);
            if (checkDB.usernameExist || checkDB.emailExist) {
                res.status(403).json({ error: "Username or email exist" })
            } else {
                try {
                    await db.userSingup(validate.validData);
                    res.status(201).redirect('/login');
                } catch (error) {
                    res.status(500).json({ error: "Internal error with add the data to the db" })
                }

            }
        }
    });


module.exports = router;