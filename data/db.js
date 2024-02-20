const mongoose = require(`mongoose`);
const { MONGO_PORT, MONGO_CONTAINER_NAME, MONGO_URI } = process.env;
const PointOfInterest = require('./models/pointOfInterest');
const Users = require('./models/user');
const Comments = require('./models/comments');
const PointOfInterest = require('./models/pointOfInterest');
const filePaths = ['./JSON/api_google_entertaiment.json', './JSON/api_google_hotels.json', './JSON/api_google_resturants.json', './JSON/api_google_stores.json', './JSON/api_google_wellness.json'];

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
    async readJsonFiles(filePaths) {
        const data = [];
        for (const filePath of filePaths) {
            try {
                const fileData = await fs.promises.readFile(filePath, 'utf-8');
                const parsedData = JSON.parse(fileData);
                data.push(...parsedData); // Merge array elements
            } catch (error) {
                console.error(`Error reading file ${filePath}:`, error);
            }
        }
        return data;
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
            const jsonData = await this.readJsonFiles(filePaths);
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