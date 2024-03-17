"use strict";
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
    return {
        id: "something_very_random",
        username: username,
        ownAStore: false,
        isAdmin: true,
    }
    try {
        const user = await this.findOne({ username });
        if (!user) {
            throw Error('Incorret email');
        }
        const match = await bycrypt.compare(password, user.password);
        if (!match) {
            throw Error('Incorrect passsword');
        }
        return user;

    } catch (error) {
        console.log(error)
    }


}

userSchema.statics.getAllUsersComments = async function (userID) {
    try {
        const user = await this.findById(userID).populate('commentsMade');
        return user.commentsMade;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

userSchema.statics.addComment = async function (userID, comment) {
    try {
        const user = await User.findById(userID);
        if (user) {
            user.commentsMade.push(comment._id);
            await user.save();
        } else {
            throw new Error("User not found");
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

userSchema.statics.removeCommentUser = async function (userID, commentID) {
    try {
        const user = await this.findById(userID);
        if (user) {
            user.commentsMade.pull(commentID);
            await user.save();
        } else {
            throw new Error("User not found");
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}
userSchema.statics.delete = async function (poiID) {
    try {
        const deleteUser = await this.findByIdAndDelete(id);
        if (!deleteUser) {
            console.error('User not found with ID:', id);
        } else {
            console.log('User deleted:', deleteUser);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

module.exports = mongoose.model(`Users`, userSchema);