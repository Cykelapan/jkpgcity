"use strict";
const mongoose = require('mongoose');
const API_PINS = require('./../../API/api_pins_google');

//TODO: REMBER DUPLETS!!!! hotels has resturangs as well as living, 
const itemPointOfInterest = mongoose.Schema({
    google_id: {
        type: String,
    },

    name: String,
    addres: String,
    district: {
        type: String,
        require: true,
        enum: [API_PINS.PLACENAME.PIREN,
        API_PINS.PLACENAME.SÖDER,
        API_PINS.PLACENAME.VÄSTER,
        API_PINS.PLACENAME.TÄNDSTICKSOMRÅDET,
        API_PINS.PLACENAME.ÖSTER
        ]
    },
    openingHours: [String],

    website: String,
    description: String,
    contactPhoneNumber: String,
    coordinates: {
        latitude: Number,
        longitude: Number,
    },
    linkGoogleMaps: String,

    interestType: {
        type: [String],
        required: true,
        enum: [
            API_PINS.INTEREST.STORES,
            API_PINS.INTEREST.WELLNESS,
            API_PINS.INTEREST.RESTURANTS,
            API_PINS.INTEREST.HOTELS,
            API_PINS.INTEREST.ENTERTAIMENT
        ]
    },

    //rating should be like or dislike, and the number of like and dislike it have
    rating: {
        type: { like: Number, dislike: Number },
        default: { like: 0, dislike: 0 },
    },

    numberOfRatings: {
        type: Number,
        default: 0,
        virtual: true,
        get: function () {
            return this.rating.like + this.rating.dislike
        }
    },

    //comments that the store have
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    numberOfComments: {
        type: Number,
        default: 0,
        virtual: true,
        get: function () {
            return this.comments.lenght
        }
    },

    moreInformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemMoreInformation'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

itemPointOfInterest.statics.findByDistrict = async function (inDistrict) {
    return await this.find({ district: inDistrict });
};

itemPointOfInterest.statics.findByInterest = async function (inType) {
    return await this.find({ interestType: inType });
};

itemPointOfInterest.statics.findByDistrictAndIntrest = async function (inDistrict, inType) {
    return await this.find({ district: inDistrict, interestType: inType });
};


itemPointOfInterest.statics.getAllComments = async function (poiID) {
    try {
        const poi = await this.findById(poiID).populate('comments');
        return poi.comments;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

itemPointOfInterest.statics.addComment = async function (poiID, comment) {
    try {
        const poi = await this.findById(poiID);
        if (poi) {
            poi.comments.push(comment._id);
            await poi.save();
        } else {
            throw new Error("Point of Interest not found");
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}
itemPointOfInterest.statics.removeComment = async function (poiID, commentID) {
    try {
        const poi = await this.findById(poiID);
        if (poi) {
            poi.comments.pull(commentID);
            await poi.save();
        } else {
            throw new Error("Point of Interest not found");
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

itemPointOfInterest.statics.addLike = async function (inID) {
    try {
        const poi = await this.findById(inID);
        if (poi) {
            poi.rating.like++;
            await poi.save();
            return poi;
        } else {
            throw new Error("Point of Interest not found");
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

itemPointOfInterest.statics.addDislike = async function (inID) {
    try {
        const poi = await this.findById(inID);
        if (poi) {
            poi.rating.dislike++;
            await poi.save();
            return poi; // Return the updated document
        } else {
            throw new Error("Point of Interest not found");
        }
    } catch (err) {
        console.error(err);
        throw err; // Re-throw to allow error handling at the calling side
    }
}


module.exports = mongoose.model('PointOfInterest', itemPointOfInterest)