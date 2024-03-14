const jwt = require('jsonwebtoken');

const jwtPayLoad = {
    id: String,
    username: String,
    ownAStore: Boolean,
    storeID: String,
    isAdmin: Boolean
};

const createToken = (userData) => {
    try {
        const payload = {
            id: userData._id,
            username: userData.username,
            ownAStore: userData.isStoreOwner,
            isAdmin: userData.isAdmin,
        };
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    } catch (error) {
        console.error('Error creating token:', error);
        return
    }
};

const refreshToken = async (token) => {
    if (validate.isJWT(token)) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodeToken) => {
            if (err) {
                return
            } else {
                console.log(decodeToken);
                const refreshedToken = jwt.sign(decodeToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
                return await refreshedToken
            }
        });
    } else {
        return
    }


};


module.exports = {
    createToken,
}