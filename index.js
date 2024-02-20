<<<<<<< Updated upstream
=======
const dotenv = require('dotenv').config();
if (dotenv.error) {
    console.error('Error loading .env file:', dotenv.error);
    process.exit(1);
}
const { SERVER_PORT, } = process.env;

const express = require(`express`);
const DB = require(`./data/db`)
const app = express();


//git fetch origin
///git checkout 1-test-issues

app.get('/', async (req, res) => {
    console.log('Hello world')
    res.send('<h1>Hello world</h1>');
})

const setupServer = async () => {
    db = new DB();
    await db.entryData();
    app.listen(SERVER_PORT, () => { console.log(`Server runing on ${SERVER_PORT}`) });
}
setupServer()
>>>>>>> Stashed changes
