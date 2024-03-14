

async function setCookieWithToken(res, token) {
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + 36000 * 30),
        httpOnly: true, // Prevent client-side script access
        //secure: true,   // Only send over HTTPS (if applicable)
        sameSite: 'strict', // Mitigate CSRF attacks
        path: '/',
    });
};

async function removeCookie(res) {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() - 1000),
        httpOnly: true,
        //secure: true, // Uncomment if using HTTPS
        sameSite: 'strict'
    });
};

module.exports = {
    setCookieWithToken,
    removeCookie
};