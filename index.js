"use strict";
const path = require('node:path');

const dotenv = require('dotenv').config();
const { SERVER_PORT } = process.env;

if (dotenv.error) {
  console.error(dotenv.error);
  process.exit(1);
}

const cookieParser = require('cookie-parser');
const express = require(`express`);
const app = express();

const auth = require('./backend/auth/authToken');
const checkToken = require('./backend/auth/refreshToken');

const DB = require('./backend/data/db');
const db = new DB();

app.use(express.static(path.join(__dirname, "frontend")));

//How to send the db in another way?
app.use((req, res, next) => {
  req.db = db;
  next();
});
app.use(checkToken);

app.use('/discover', require('./routes/discover'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));

app.use('/contact', require('./routes/contact'));
app.use('/districts', require('./routes/district'));
app.use('/userpage', auth.requiredUserLoggedIn, require('./routes/user'));

//app.use('/intrest', require('./routes/interstOverview'));
app.get('/', checkToken, async (req, res) => {
  const htmlFilePath = path.join(__dirname, "./frontend", "index.html")

  res.sendFile(htmlFilePath)
});

app.listen(SERVER_PORT, async (error) => {
  if (error) { console.log(error); }
  //await db.connect();
  //await db.entryData();
  console.log(`Server runing on ${SERVER_PORT}`)
});
