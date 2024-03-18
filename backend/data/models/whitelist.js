"use strict";
const mongoose = require('mongoose');

const itemWhitelist = mongoose.Schema({
    token: {
        type: String,
        unique: true,
        required: true
    }

});
itemWhitelist.statics.add = async function (token) {
    try {
        const newToken = new this({ token });
        await newToken.save();
        return true;
    } catch (err) {
        if (err.code === 11000) {
            console.error('Token already exists in the whitelist');
            return false;
        } else {
            console.error('Error adding token to whitelist:', err);
            throw err;
        }
    }
}
itemWhitelist.statics.isValid = async function (token) {
    const foundToken = await this.findOne({ token });
    return foundToken !== null;
}
itemWhitelist.statics.delete = async function (token) {
    try {
        await this.deleteOne({ token });
        return true
    } catch (err) {
        console.error('Error deleting token from whitelist:', err);
        return false
    }
}

module.exports = mongoose.model('Whitelist', itemWhitelist);