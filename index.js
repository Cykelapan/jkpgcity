"use strict";
const path = require('node:path');
const { INTEREST } = require('./backend/API/api_pins_google.js');

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

const db = require('./backend/data/db');

app.use(express.static(path.join(__dirname, "frontend")))
app.use(checkToken);


app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/contact', require('./routes/contact')); //används ej?
app.use('/districts', require('./routes/district'));
app.use('/userpage', auth.requiredUserLoggedIn, require('./routes/user')); // hur ska den användas
//app.use('/admin', auth.requiredAdminLoggedIn, requrie('./routes/admin')); // används ej?

app.get("/interestType", async (req, res) => {
  res.json(INTEREST);
});

app.get('/', async (req, res) => {
  const htmlFilePath = path.join(__dirname, "./frontend", "index.html")

  res.status(200).sendFile(htmlFilePath)
})


const setupServer = async () => {
  await db.connect();
  await db.entryData();
  console.log("SETUP")
  app.listen(SERVER_PORT, (error) => { if (error) { console.log(error); } })
}
setupServer();

/*
app.listen(SERVER_PORT, async (error) => {
  if (error) { console.log(error); }
  await db.connect();
  await db.entryData();
  console.log(`Server runing on ${SERVER_PORT}`)
});
*/