"use strict";
const getDecodedToken = require('./getDecodedToken');


//todo Make specifc auth for routes that needs it
/* Eg. userloggedIn, adminLoggedIn, logout
then get tokenData? 
Create Token in one place login, refresh token when? Middleware allways?  */

const requiredAdminLoggedIn = async (req, res, next) => {
    const decodeToken = await getDecodedToken(req.headers.authorization);
    if (decodeToken) {
        if (decodeToken.isAdmin) next();
        else res.status(401).json({ message: 'Only admin allowed' }).redirect('/login');
    } else {
        res.status(401).json({ message: 'Only admin allowed' }).redirect('/login');
    }
};

const requiredUserLoggedIn = async (req, res, next) => {
    const decodeToken = await getDecodedToken(req.headers.authorization);
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
