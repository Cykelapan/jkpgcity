const mongoose = require(`mongoose`);
const { MONGO_PORT, MONGO_CONTAINER_NAME, MONGO_URI } = process.env;
const PointOfInterest = require('./models/pointOfInterest');
const fs = require('fs');
const Users = require('./models/user');
const Comments = require('./models/comments');
const filesdasdasdadPath = ['./data/JSON/api_google_stores.json', './data/JSON/api_google_wellness.json', './data/JSON/api_google_resturants.json', './data/JSON/api_google_entertaiment.json', './data/JSON/api_google_hotels.json'];
const filePathData = './data/JSON/api_google_allData.json';
//need to know if it is better to make one schema with all the diffrent types and querie it or use diffrent schemas?
class DB {
    constructor() {
        this.db = undefined;
        this.mongoose = mongoose;

        this.connect();
    }

    async connect() {
        try {
            const url = MONGO_URI || `mongodb://localhost:${MONGO_PORT}/${MONGO_CONTAINER_NAME}`
            await this.mongoose.connect(url);
            console.log('DB connected');
            this.db = this.mongoose.connection;
        } catch (error) {
            console.error('Error connecting to database:', error);
        }
    }


    async close() {
        if (this.db) {
            await this.db.close();
            console.log('DB connection closed');
        }
    }
    //******************** GET DATA ******************************* */

    async readJsonFile(path) {

        try {
            const fileData = await fs.promises.readFile(path, 'utf-8');
            return await JSON.parse(fileData);
        } catch (error) {
            console.error(`Error reading file ${path}:`, error);
        }
    }

    async insertPOIs(data) {
        try {
            const insertedPOIs = await PointOfInterest.insertMany(data);
            console.log(`${insertedPOIs.length} POIs inserted successfully.`);
        } catch (error) {
            // If some objects fail due to validation, error.insertedIds will contain IDs of successful insertions
            console.error('Error inserting POIs:', error);
            if (error.insertedIds) {
                const failedIndices = [...Array(data.length).keys()].filter(i => !error.insertedIds.includes(i));
                console.error('Failed object indices:', failedIndices);
            }
        }
    }

    async entryData() {
        const count = await PointOfInterest.countDocuments();
        if (count > 5) {
            console.log(count)

        } else {
            const jsonData = await this.readJsonFile(filePathData);
            console.log(jsonData);
            await this.insertPOIs(jsonData);
        }

    }
    //******************** Stores ************************************** 
    async getAllStoresSorted() {
        return await PointOfInterest.find().sort({ name: 1 }).select({ name: 1 })
    }
    async getStoresByLetter(letter) {
        return await PointOfInterest.find().sort({ name: /^letter/i })
    }
    async getByDistrict(district) {
        return await PointOfInterest.find().sort({ district: /^district/i })

    }
    async updateStore(id) {

    }
    async addStore() {

    }

    //***************************** Users **************************************
    async addUser() {

    }

    async deleteUser() {

    }

    async getUser(id) {

    }

    //***************************** Comments **************************************


}

module.exports = DB;