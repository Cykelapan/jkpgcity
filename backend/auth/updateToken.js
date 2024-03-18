"use strict";
const jwt = require('jsonwebtoken');
const validate = require("validator");
const db = require('../data/db.js')

async function refreshJWTtoken(token, ownAStore) {
    const payload = {
        id: token.id,
        username: token.username,
        ownAStore: token.ownAStore,
        isAdmin: token.isAdmin,
    }
    const newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    await db.removeToken(token);
    await db.addToken(newToken);
    res.header('Authorization', `Bearer ${newToken}`);
}
