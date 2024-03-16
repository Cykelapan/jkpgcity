"use strict";
const mongoose = require('mongoose')

const itemMoreInformation = mongoose.Schema({
    header: String,
    content: String,
    section1: {
        subtitle: String,
        content: String,
    },
    section2: {
        subtitle: String,
        content: String,
    },
    iconImage: String,
    bgImage: String,
    color: String,


});