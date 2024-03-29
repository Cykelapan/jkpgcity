"use strict";
const validate = require("validator");
const jwt = require('jsonwebtoken');
const db = require('../data/db.js')

async function isAnValidToken(bearer) {
    if (!bearer) return null;
    if (!bearer.startsWith("Bearer ")) return null;

    let token = bearer.split(' ')[1];
    if (validate.isJWT(token)) {
        const isOnWhiteList = db.isValidToken(token)
        if (isOnWhiteList) return token;
    }
    return null;
}

async function getVerifyToken(token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodeToken) => {
            if (err) {
                resolve(null);
                await db.removeToken(token)
            } else {
                resolve(decodeToken);
            }
        });
    });
}

async function getDecodeToken(bearer) {
    let token = await isAnValidToken(bearer);

    if (!token) { return null; }

    return await getVerifyToken(token);
};

module.exports = getDecodeToken