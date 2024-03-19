"use strict";
const mongoose = require('mongoose')


const itemComment = mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    madeBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `User`,
        required: true
    }
});

itemComment.statics.addComment = async function (userID, commentText,) {
    const newComment = new Comment({
        comment: commentText,
        madeBy: userID
    });
    await newComment.save();
    return newComment
};

itemComment.statics.removeComment = async function (commentID) {
    const comment = await this.findById(commentID);
    comment.delete();
};


module.exports = mongoose.model('Comment', itemComment)