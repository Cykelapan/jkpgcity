const mongoose = require('mongoose');
const validate = require(`validator`);

const itemUser = mongoose.Schema({
    fName: {
        type: String,
        required: true,
    },
    lName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: validate.isEmail,
            message: 'Invalid email'
        }
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        requried: true
    },
    commentsMade: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: `Comment`
    }]

});

module.exports = mongoose.model(`User`, itemUser);