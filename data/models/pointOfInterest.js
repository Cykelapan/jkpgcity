"use strict";
const mongoose = require('mongoose');
const i = require('./../../API/api_pins_google');

//TODO: REMBER DUPLETS!!!! hotels has resturangs as well as living, 
const itemPointOfInterest = mongoose.Schema({
    google_id: {
        type: String,
    },

    name: String,
    addres: String,
    district: String,
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
        enum: [i.INTEREST.STORES, i.INTEREST.WELLNESS, i.INTEREST.RESTURANTS, i.INTEREST.HOTELS, i.INTEREST.ENTERTAIMENT]
    },

    //rating should be like or dislike, and the number of like and dislike it have
    rating: {
        type: {
            like: Number,
            dislike: Number,
        },
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

// add functions for schema when updating like / dislike, comment and more information, also how the updated functions should be

module.exports = mongoose.model('PointOfInterest', itemPointOfInterest)