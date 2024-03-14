const dotenv = require('dotenv').config();
if (dotenv.error) {
    console.error('Error loading .env file:', dotenv.error);
    process.exit(1);
}
const { SERVER_PORT, } = process.env;
const cookieParser = require('cookie-parser');
const express = require(`express`);
const DB = require(`./data/db`);
const db = new DB();
const app = express();
const auth = require('./auth/authToken');
const checkToken = require('./auth/refreshToken');




//How to send the db in another way?
app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use('/discover', require('./routes/discover'),);
app.use('/login', require('./routes/login'));
app.use('/contact', require('./routes/contact'),);
app.use('/districts', require('./routes/district'),);
app.use('/userpage', auth.userLoggedInRequired, require('./routes/user'));
app.use('/intrest', require('./routes/interstOverview'));
app.get('/', checkToken, async (req, res) => {
    const data = "await db.getAllStoresSorted();"

    res.send(`<h1>Hello world</h1> <h4> ${data}  </h4>`);
})

const setupServer = async () => {
    await db.connect();
    await db.entryData();
    app.listen(SERVER_PORT, () => { console.log(`Server runing on ${SERVER_PORT}`) });
}
setupServer();
