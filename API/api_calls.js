"use strict";
const dotenv = require('dotenv').config();
if (dotenv.error) {
    console.error('Error loading .env file:', dotenv.error);
    process.exit(1);
}
const { API_KEY_GEOAPIFY, } = process.env;

const API_URL = {
    SUPERMARKETS: `https://api.geoapify.com/v2/places?categories=commercial.supermarket&filter=circle:14.173161595253987,57.77703948111014,2150&bias=proximity:14.173161595253987,57.77703948111014&lang=en&limit=50&apiKey=${API_KEY_GEOAPIFY}`,
    MALLS: `https://api.geoapify.com/v2/places?categories=commercial.shopping_mall&filter=circle:14.173161595253987,57.77703948111014,2150&bias=proximity:14.173161595253987,57.77703948111014&lang=en&limit=2&apiKey=${API_KEY_GEOAPIFY}`,
    STORES: `https://api.geoapify.com/v2/places?categories=commercial&filter=circle:14.1747191071712,57.77705659766579,1950&bias=proximity:14.1747191071712,57.77705659766579&lang=en&limit=500&apiKey=${API_KEY_GEOAPIFY}`,
    RESTURANTS: `https://api.geoapify.com/v2/places?categories=catering.restaurant,catering.fast_food,catering.cafe&filter=circle:14.170228300375129,57.776449338707806,1950&bias=proximity:14.170228300375129,57.776449338707806&lang=en&limit=150&apiKey=${API_KEY_GEOAPIFY}`,
    HOTELS: `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:14.170228300375129,57.776449338707806,1950&bias=proximity:14.170228300375129,57.776449338707806&lang=en&limit=150&apiKey=${API_KEY_GEOAPIFY}`,
    ENTERTAIMENT: `https://api.geoapify.com/v2/places?categories=entertainment&filter=circle:14.170228300375129,57.776449338707806,1950&bias=proximity:14.170228300375129,57.776449338707806&lang=en&limit=12&apiKey=${API_KEY_GEOAPIFY}`
};


function getRestriction(category) {
    switch (category) {
        case API_URL.SUPERMARKETS:
            return ['Netto', 'Chili Basilika', undefined,]

        case API_URL.MALLS:
            return ['Netto', 'Chili Basilika', 'Sesam', undefined,]

        case API_URL.STORES:
            return ['Asecs', 'Netto', 'Chili Basilika', 'fountain', 'Sesam', undefined,]

        case API_URL.RESTURANTS:
            return [undefined,]

        case API_URL.HOTELS:
            return [undefined,]

        case API_URL.ENTERTAIMENT:
            return [undefined,]

        default:
            break;
    }
}

function getFileName(category) {
    switch (category) {
        case API_URL.SUPERMARKETS:
            return 'api_stores.json'

        case API_URL.MALLS:
            return 'api_stores.json'

        case API_URL.STORES:
            return 'api_stores.json'

        case API_URL.RESTURANTS:
            return 'api_resturants.json'

        case API_URL.HOTELS:
            return 'api_hotels.json'

        case API_URL.ENTERTAIMENT:
            return 'api_entertaiment.json'

        default:
            break;
    }
}



module.exports = {
    API_URL,
    getRestriction,
    getFileName,
};