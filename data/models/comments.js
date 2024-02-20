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
})

console.log('Comments schema has been created')

module.exports = mongoose.model('Comment', itemComment)