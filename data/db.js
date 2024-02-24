const mongoose = require(`mongoose`);
const { MONGO_PORT, MONGO_CONTAINER_NAME, MONGO_URI } = process.env;
const PointOfInterest = require('./models/pointOfInterest');
const fs = require('fs');
const Users = require('./models/user');
const Comments = require('./models/comments');
const { log } = require('console');
const filesdasdasdadPath = ['./data/JSON/api_google_stores.json', './data/JSON/api_google_wellness.json', './data/JSON/api_google_resturants.json', './data/JSON/api_google_entertaiment.json', './data/JSON/api_google_hotels.json'];
const filePathData = './data/JSON/api_google_allData.json';
//need to know if it is better to make one schema with all the diffrent types and querie it or use diffrent schemas?
class DB {
    constructor() {
        this.db = undefined;
        this.mongoose = mongoose;
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
    async getPOIByID(ID) {
        return await PointOfInterest.findById(ID).select({});
    }
    async getPOITypes(INTEREST) {
        return await PointOfInterest.find({ interestType: INTEREST })
            .select('_id name district rating.like rating.dislike numberOfComments')
            .sort({ name: 1 });
    }
    async updatePOILikes(likeType, ID) {
        try {
            await PointOfInterest.findByIdAndUpdate(ID, {
                $inc: { [`rating.${likeType}`]: 1 }
            } // Increment specific like/dislike count
            );
        } catch (error) {
            console.error(error);
            // Handle errors
        }
    }

    //see if you need this or not
    async getPOIComments(ID) {

    }
    async addPOIComments(poiID, userID, comment) {
        try {
            //check if user exist
            const user = await Users.findById(userID);
            if (!user) {
                console.log("USER DOSEN'T EXIST WHEN ADD COMMENT");
                return

            }
            const newComment = new Comment({
                user: userId,
                content: comment,
            });

            await PointOfInterest.findByIdAndUpdate(
                poiId,
                { $push: { comments: newComment } }
            );

            poi.comments.push(newComment);
            poi.numberOfComments = poi.comments.length;

            await poi.save();
            console.log('Comment added successfully!');
        } catch (error) {
            console.error(error);
            // Handle errors appropriately
        }


    }
    // se how you can use the frontend of what you should update
    async updatePOI(ID) {

    }

    //***************************** Users **************************************
    async addUser(userObject) {
        try {
            const newUser = new User({
                fName: userObject.fName,
                lName: userObject.lName,
                email: userObject.email,
                username: userObject.username,
                password: userObject.password // Use strong password hashing in practice!
            });
            await newUser.save();
        } catch {
            console.log("SOMETING WRONG WHEN SAVE A NEW USER");
        }

    }

    async checkUsername(email) {
        try {
            const existingUser = await User.findOne({ username });
            return !!existingUser; // Returns true if user exists, false otherwise
        } catch (error) {
            console.error('Error checking username:', error);
        }
    }
    async checkEmail(email) {
        try {
            const existingUser = await User.findOne({ email });
            return !!existingUser; // Returns true if user exists, false otherwise
        } catch (error) {
            console.error('Error checking email:', error);

        }
    }

    async getUser(id) {
        return await Users.findById(userID).select({});
    }

    //***************************** Comments **************************************


}

module.exports = DB;