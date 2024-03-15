"use strict";
const jwt = require('jsonwebtoken');

const jwtPayLoad = {
    id: String,
    username: String,
    ownAStore: Boolean,
    storeID: String,
    isAdmin: Boolean
};

function createToken(userData) {
  try {
    const payload = {
      id: userData._id,
      username: userData.username,
      ownAStore: userData.isStoreOwner,
      isAdmin: userData.isAdmin,
    }
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
  } 
  catch (error) {
    console.error('Error creating token:', error);
    return null
  }
}



module.exports = {
    createToken,
}