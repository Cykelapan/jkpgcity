"use strict";
const mongoose = require('mongoose');

const itemUserSettings = mongoose.Schema({
    avatarURL: {
        type: String
    },
    imageURL: {
        type: String
    }

})

module.exports = mongoose.model(`UsersSettings`, itemUserSettings);