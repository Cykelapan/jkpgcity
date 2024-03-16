"use strict";
const JWT = require('jsonwebtoken');
const validate = require("validator");
const { getDecodeToken } = require('./getDecodedToken.js');
const { models } = require('mongoose');

//should have an white or blacklist with valid tokens in the db for extra security..
// have an answer evreyt time the comes and token in the header
async function refreshJWTtoken(token, res) {
    const payload = {
        id: token.id,
        username: token.username,
        ownAStore: token.ownAStore,
        isAdmin: token.isAdmin,
    }
    const newToken = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    res.header('Authorization', `Bearer ${newToken}`);
};


const checkToken = async (req, res, next) => {
    try {
        const token = await getDecodeToken(req.headers.authorization);
        if (token) {
            const expirationTime = token.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            if ((expirationTime - currentTime) < 450) await refreshJWTtoken(decodeToken, res), next();
        } else {
            next();
        }
    } catch (err) {
        console.log('Error at catch', err);
        next();
    }
};


module.exports = checkToken;


