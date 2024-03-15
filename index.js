"use strict";
const dotenv = require('dotenv').config();
const { SERVER_PORT } = process.env;

const cookieParser = require('cookie-parser');
const express = require(`express`);
const app = express();

const auth = require('./auth/authToken');
const checkToken = require('./auth/refreshToken');

const DB = require(`./data/db`);
const db = new DB();

//How to send the db in another way?
app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use('/discover', require('./routes/discover'));
app.use('/login', require('./routes/login'));
app.use('/contact', require('./routes/contact'));
app.use('/districts', require('./routes/district'));
app.use('/userpage', auth.userLoggedInRequired, require('./routes/user'));
app.use('/intrest', require('./routes/interstOverview'));
app.get('/', checkToken, async (req, res) => {
    const data = "await db.getAllStoresSorted();"

    res.send(`<h1>Hello world</h1> <h4> ${data}  </h4>`);
})

app.listen(SERVER_PORT, async () => {
  await db.connect();
  await db.entryData();
  console.log(`Server runing on ${SERVER_PORT}`)
});
