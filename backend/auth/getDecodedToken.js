"use strict";
const { isNil } = require('lodash');
const validate = require("validator");
const jwt = require('jsonwebtoken');

async function isAnValidToken(bearer) {
    if (!bearer) return null;
    let token = bearer.split(' ')[1];
    if (validate.isJWT(token)) return token;
    return null;
}

async function getDecodeToken(bearer) {
    let token = await isAnValidToken(bearer);
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodeToken) => {
            if (decodeToken) return decodeToken;
            else return null
        });
    } else {
        return null
    };
};

module.exports = { getDecodeToken };