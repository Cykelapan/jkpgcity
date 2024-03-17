const API_PINS = require('../API/api_pins_google');

async function checkDistrict(inValue) {
    for (i in API_PINS.PLACENAME) {
        if (i.toLowerCase() === inValue.toLowerCase()) return true
    }
    return false
}

async function checkIntrest(inValue) {
    for (i in API_PINS.INTEREST) {
        if (i.toLowerCase() === inValue.toLowerCase()) return true
    }
    return false
}


module.exports = {
    checkDistrict,
    checkIntrest
}