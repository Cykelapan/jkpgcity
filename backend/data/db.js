"use strict";
const fs = require('node:fs');
const { MONGO_PORT, MONGO_CONTAINER_NAME, MONGO_URI } = process.env;
const mongoose = require("mongoose");
const PointOfInterest = require('./models/pointOfInterest');
const Users = require('./models/user');
const Comments = require('./models/comments');
const TrackTokens = require('./models/whitelist');
const filePathData = 'backend/data/JSON/api_google_allData.json';
//need to know if it is better to make one schema with all the diffrent types and querie it or use diffrent schemas?
class DB {
    constructor() {
        if (DB.instance) {
            console.log('Comments schema has been created')
            return DB.instance;
        }

        this.db = undefined;
        this.mongoose = mongoose;
        DB.instance = this;
    }

    async connect() {
        try {
            console.log('Comments schema has been created')
            console.log(MONGO_URI)
            const url = MONGO_URI || 'mongodb://localhost:27017/development'
            await this.mongoose.connect(url);
            console.log('DB connected');
            this.db = this.mongoose.connection;
        } catch (error) {
            console.error('Error connecting to database:', error);
        }
    }
    async checkConnection() {
        try {
            await this.command({ ping: 1 });
            console.log("Connection");
        } catch (error) {
            console.error('Ping failed:', error);
            this.connect();
        }
    }


    async close() {
        if (this.db) {
            await this.close();
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
    async getAllDirstrict() {
        return await PointOfInterest.getAllDistrictsName();
    }
    async getPOIAll() {
        const pois = await PointOfInterest.find().select({}).sort({ name: 1 });
        return pois
    }
    async createNewPOI(inData, userID) {
        const poi = await PointOfInterest.createPOI(inData);
        if (poi) {
            console.log(poi)
            const updateUser = await Users.addStore(userID, poi.id)
            if (!updateUser) console.log("ERROR TO UPDATE USER IS STORE OWNER");
            else return poi
        } else {
            return null
        }

    }
    async getPOIByID(ID) {
        return await PointOfInterest.findById(ID).select({});
    }
    async getPOITypes(INTEREST) {
        return await PointOfInterest.findByInterest(INTEREST);
    }
    async getPOIDistrict(DISTRICT) {
        return await PointOfInterest.findByDistrict(DISTRICT);
    }
    async getPOIDistrictIntrest(DISTRICT, INTEREST) {
        return await PointOfInterest.findByDistrictAndIntrest(DISTRICT, INTEREST);
    }
    async getPOIComments(ID) {
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
    async updatePOI(ID, inData) {
        const poi = await PointOfInterest.updatePOI(ID, inData);
        return poi
    }
    async deletPOI(ID) {
        console.log(ID)
        const isDeleted = await PointOfInterest.delete(ID);
        return isDeleted
    };

    //***************************** Users **************************************

    //Could return user and create a token at once
    async userSingup(userObject) {
        try {
            const newUser = new Users(userObject);
            await newUser.save();
        } catch (error) {
            console.log(error)
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
    async getUserPOI(userID) {
        const poiIDs = await Users.getStoresID(userID);
        if (poiIDs.length === 0) {
            return null
        } else {
            const pois = await PointOfInterest.find({ _id: { $in: poiIDs } });
            return pois
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
    async deleteStore(userID, storeID) {
        await Users.deleteStoreByID(userID, storeID)
    }

    async addToken(token) {
        try {
            const isAdded = await TrackTokens.add(token)
        } catch (error) {

        }
    }
    async isValidToken(token) {
        return await TrackTokens.isValid(token)
    };

    async removeToken(token) {
        return await TrackTokens.delete(token)
    };

}
console.log('DB is created');

module.exports = new DB();