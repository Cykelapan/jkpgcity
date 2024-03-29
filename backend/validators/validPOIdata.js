"use strict";
const API_PINS = require('../API/api_pins_google');

async function checkDistrict(inValue) {
    for (let i in API_PINS.PLACENAME) {
        if (i.toLowerCase() === inValue.toLowerCase()) return (i.charAt(0).toUpperCase() + i.slice(1).toLowerCase())
    }
    return null
}

async function checkIntrest(inValue) {
    let intrest = []
    for (let i in API_PINS.INTEREST) {
        if (i.toLowerCase() === inValue.toLowerCase()) intrest.push(i.toLowerCase())
    }
    return intrest
}

async function getValidDataObject(inValue) {
    const district = await checkDistrict(inValue.district)
    const intrest = await checkIntrest(inValue.interestType)
    if (intrest.length == 0 || !district) return null
    else return {
        google_id: inValue.google_id ?? "",
        name: inValue.storeName ?? "No name",
        address: inValue.streetName ?? "unknown",
        district: district,
        openingHours: "unknown",
        website: inValue.website ?? "unknown",
        description: inValue.description,
        contactPhoneNumber: inValue.contactNumber,
        coordinates: {
            longitude: 0,
            latitude: 0
        },
        linkGoogleMaps: inValue.googlemaps,
        interestType: intrest
    }
}


module.exports = getValidDataObject
