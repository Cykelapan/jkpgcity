const mongoose = require('mongoose');
const validate = require(`validator`);
const bycrypt = require('bcrypt');

const userSchema = mongoose.Schema({
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
        required: true
    },
    password: {
        type: String,
        requried: true
    },
    isStoreOwner: {
        type: Boolean,
        requried: true,
        default: false
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PointOfInterest',
    },

    commentsMade: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: `Comment`
    }]

}).pre('save', async function () {
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
});

userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if (!user) {
        throw Error('Incorret email');
    }

    const match = await bycrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect passsword');
    }
    return user;

};


module.exports = mongoose.model(`Users`, userSchema);