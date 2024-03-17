"use strict";
const fs = require('node:fs');
const { MONGO_PORT, MONGO_CONTAINER_NAME, MONGO_URI } = process.env;
const mongoose = require("mongoose");
const PointOfInterest = require('./models/pointOfInterest');
const Users = require('./models/user');
const Comments = require('./models/comments');
const filePathData = './data/JSON/api_google_allData.json';
//need to know if it is better to make one schema with all the diffrent types and querie it or use diffrent schemas?
class DB {
    static shared = null;
    constructor() {
        if (DB.instance) {
            return DB.instance;
        }

        this.db = undefined;
        this.mongoose = mongoose;

        DB.instance = this;
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
    async checkConnection() {
        try {
            await this.db.command({ ping: 1 });
            console.log("Connection");
        } catch (error) {
            console.error('Ping failed:', error);
            this.db.connect();
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
    //******************** POI ************************************** 
    async getPOIAll() {
        await this.checkConnection()
        const pois = await PointOfInterest.find().select({});
        return pois
    }
    async getPOIByID(ID) {
        await this.checkConnection()
        return await PointOfInterest.findById(ID).select({});
    }
    async getPOITypes(INTEREST) {
        await this.checkConnection()
        return await PointOfInterest.findByInterest(INTEREST);
    }
    async getPOIDistrict(DISTRICT) {
        await this.checkConnection()
        return await PointOfInterest.findByDistrict(DISTRICT);
    }
    async getPOIDistrictIntrest(DISTRICT, INTEREST) {
        await this.checkConnection()
        return await PointOfInterest.findByDistrictAndIntrest(DISTRICT, INTEREST);
    }
    async getPOIComments(ID) {
        await this.checkConnection()
        return PointOfInterest.getAllComments(ID)
    }
    async postPOILikes(isLike, ID) {
        try {
            if (isLike) PointOfInterest.addLike(ID)
            else PointOfInterest.addDislike(ID)

        } catch (error) {
            console.error(error);
            // Handle errors
        }
    }
    async deletePOIComment(poiID, userID, commentID) {
        await Comments.removeComment(commentID);
        await PointOfInterest.removeComment(poiID, commentID);
        await Users.removeCommentUser(userID, commentID);
    };

    async postPOIComment(poiID, userID, inComment) {
        const newComment = await Comments.addComment(userID, inComment);
        if (newComment) {
            PointOfInterest.addComment(poiID, newComment);
            Users.addComment(userID, newComment);
        } else {
            await Comments.removeComment(newComment._id);;
        }
    }

    //vad ska uppdateras?
    async updatePOI(ID, inData) {
        return
    }
    async deletPOI(ID) {
        await PointOfInterest.delete(ID);
    };

    //***************************** Users **************************************

    //Could return user and create a token at once
    async userSingup(userObject) {
        try {
            console.log(userObject);
            let newUser = new Users(userObject);
            await newUser.save();
        } catch (error) {
            console.log(error)
            console.error(`Error message: ${error.message}`);
            console.log("SOMETING WRONG WHEN SAVE A NEW USER");
            throw error;
        }
    }

    async getUserLogin(username, password) {
        try {
            return await Users.login(username, password);
        } catch (error) {
            console.log("getUserLogin:", error);
            return null
        }
    }

    async checkUsernameAndEmail(username, email) {
        try {
            const existingUsername = await Users.findOne({ username });
            const existingEmail = await Users.findOne({ email });
            return {
                usernameExist: !!existingUsername,
                emailExist: !!existingEmail
            }
        } catch (error) {
            console.error('Error checking username:', error);
        }
    }

    async checkEmail(email) {
        try {
            const existingUser = await Users.findOne({ email });
            return !!existingUser; // Returns true if user exists, false otherwise
        } catch (error) {
            console.error('Error checking email:', error);
        }
    }

    async getUser(id) {
        return await Users.findById(userID).select({});
    }
    async deletUser(ID) {
        await Users.delete(ID);
    };




}

//är en singleton nu?
module.exports = new DB();