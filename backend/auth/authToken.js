"use strict";
const { getDecodeToken } = require('./getDecodedToken.js');

//todo Make specifc auth for routes that needs it
/* Eg. userloggedIn, adminLoggedIn, logout
then get tokenData? 
Create Token in one place login, refresh token when? Middleware allways?  */

async function requiredAdminLoggedIn(req, res, next) {
    const decodeToken = await getDecodeToken(req.get("Authorization"));
    if (decodeToken) {
        if (decodeToken.isAdmin) next();
        else res.status(401).json({ message: 'Only admin allowed' });
    } else {
        res.status(401).json({ message: 'Only admin allowed' });
    }
};

async function requiredUserLoggedIn(req, res, next) {
    const decodeToken = await getDecodeToken(req.get("Authorization"));
    if (decodeToken) {
        next();
    } else {
        res.redirect('/');
    }
};





module.exports = {
    requiredUserLoggedIn,
    requiredAdminLoggedIn,
};
