"use strict";
const jwt = require('jsonwebtoken');
const validate = require(`validator`);

//todo Make specifc auth for routes that needs it
/* Eg. userloggedIn, adminLoggedIn, logout
then get tokenData? 
Create Token in one place login, refresh token when? Middleware allways?  */
async function isAnValidToken(bearer) {
    if (!bearer) return null;
    let token = bearer.split(' ')[1];
    if (validate.isJWT(token)) return token;
    return null;

};
async function getDecodeToken(bearer, res) {

    let token = await isAnValidToken(bearer);
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodeToken) => {
            if (err) {
                res.status(401).json({ message: 'Your session has expired. Please re-login.' }).redirect('/login');
            } else {
                return decodeToken;
            }
        });
    } else {
        res.status(401).json({ message: 'No valid JWT token. Please login to do that.' }).redirect('/login');
    };


}

const requiredAuth = (req, res, next) => {
    const authorizationHeader = req.authorizationHeader
    console.log(authorizationHeader);
    next();
};

const requiredAuthAdmin = async (req, res, next) => {
    const decodeToken = await getDecodeToken(req.headers.authorization);
    if (decodeToken.isAdmin) next();
    else redirect('/');
}

const requiredAuthStoreOwner = async (req, res, next) => {
    const decodeToken = await getDecodeToken(req.headers.authorization);
    if (decodeToken.ownAStore) next();
    else redirect('/');
}


//For specific routes that need a user that is logged in 
const userLoggedInRequired = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log(token);
        if (validate.isJWT(token)) {

        } else {
            res.status(401).json({ message: 'No valid JWT token. Please login to do that.' }).redirect('/login');
        }

    } catch {

    }
};



module.exports = {
    userLoggedInRequired,
    requiredAuth,
};

/*
const token = req.cookies.jwt;
    if (validate.isJWT(token)) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodeToken) => {
            if (err) {
                console.log(err);
                res.sendStatus(403);
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
*/ 