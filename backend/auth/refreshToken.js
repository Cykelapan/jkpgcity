"use strict";
const jwt = require('jsonwebtoken');
const validate = require("validator");
const db = require('../data/db.js')
const getDecodeToken = require('./getDecodedToken.js');
const getTokenRaw = require('./getTokenRaw.js')

//should have an white or blacklist with valid tokens in the db for extra security..
// have an answer evreyt time the comes and token in the header
async function refreshJWTtoken(token, res) {
    const payload = {
        id: token.id,
        username: token.username,
        ownAStore: token.ownAStore,
        isAdmin: token.isAdmin,
    }
    const newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    await db.addToken(newToken);
    res.header('Authorization', `Bearer ${newToken}`);
}

async function checkToken(req, res, next) {
    const token = await getDecodeToken(req.headers.authorization);
    const rawToken = await getTokenRaw(req.headers.authorization);

    if (token) {
        const expirationTime = token.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpiringSoon = (expirationTime - currentTime) < 450;
        if (isExpiringSoon) {
            await db.removeToken(rawToken);
            await refreshJWTtoken(token, res);
        }
    }

    return next();
}


module.exports = checkToken;


