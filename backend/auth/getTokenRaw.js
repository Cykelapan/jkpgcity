async function isAnValidToken(bearer) {
    if (!bearer) return null;
    if (!bearer.startsWith("Bearer ")) return null;

    return bearer.split(' ')[1];

    return null;
}

module.exports = isAnValidToken