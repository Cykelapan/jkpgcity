"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const validateRegister = require('../backend/validators/register');
const validateLogin = require('../backend/validators/login');
const jwt = require('../backend/auth/createToken');
const db = require('../backend/data/db');

router.use(bodyParser.json());

router.route('/')
  .get(async (req, res,) => {
    res.status(200).send('<h1> Login PAGE </h1>');
  })

  .post(async (req, res) => {
    // handle validation here
    const validate = await validateLogin(req.body);
    if (validate.haveErrors) {
      return res.status(400).redirect('/login');
    }
    
    const user = await db.getUserLogin(
      validate.validData.username,
      validate.validData.password
    );
    
    //user dose not exist
    if (!user) {
      return res.status(500).redirect('/login');
    }
    
    // create jwt token
    const token = await jwt.createToken(user);
    if (!token) {
      res.status(500).redirect('/login');
      return;
    }
    
    await db.addToken(token);
    // successfully identified
    res.setHeader('Authorization', `Bearer ${token}`).status(200).json({
      error: false,
      username: user.username,
      isAdmin: user.isAdmin,
      description: `${user.username} is loggin`
    });
  });


router.route('/register')
  .get(async (req, res) => {
    res.status(200).json({});
  })

  .post(async (req, res) => {
    const validate = await validateRegister(req.body);

    //if some data is missing
    if (validate.haveErrors) {
      //send back whats missing
      res.status(400).json({ error: validate.errors })
    } else {

      const checkDB = await db.checkUsernameAndEmail(
        validate.validData.username, 
        validate.validData.email
      );

      if (checkDB.usernameExist || checkDB.emailExist) {
        res.status(401).json({ error: "Username or email exist" })

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