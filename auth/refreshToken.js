"use strict";
const JWT = require('jsonwebtoken');
const validate = require(`validator`);

async function isAnValidToken(bearer) {
    if (!bearer) return null;
    let token = bearer.split(' ')[1];
    if (validate.isJWT(token)) return token;
    return null;
}

async function refreshJWTtoken(token, res) {
    const payload = {
        id: token.id,
        username: token.username,
        ownAStore: token.ownAStore,
        isAdmin: token.isAdmin,
    }
    const newToken = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    res.header('Authorization', `Bearer ${newToken}`);
}

const checkToken = async (req, res, next) => {
    try {
        let token = await isAnValidToken(req.headers.authorization);
        if (token) {
            JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodeToken) => {
                if (err) {
                    next();
                } else {
                    const expirationTime = decodeToken.exp;
                    const currentTime = Math.floor(Date.now() / 1000);
                    if ((expirationTime - currentTime) < 450) await refreshJWTtoken(decodeToken, res);
                    next();
                }
            });
        } else {
            next();
        };

    } catch (err) {
        console.log('Error at catch', err);
        next();
    }
}

module.exports = checkToken;
