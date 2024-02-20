

const INTEREST = {
    STORES: 'STORES',
    WELLNESS: 'WELLNESS',
    RESTURANTS: 'RESTURANTS',
    HOTELS: 'HOTELS',
    ENTERTAIMENT: 'ENTERTAIMENT'
}

function getFileName(category) {
    switch (category) {
        case INTEREST.WELLNESS:
            return './data/JSON/api_google_wellness.json'

        case INTEREST.STORES:
            return './data/JSON/api_google_stores.json'

        case INTEREST.RESTURANTS:
            return './data/JSON/api_google_resturants.json'

        case INTEREST.HOTELS:
            return './data/JSON/api_google_hotels.json'

        case INTEREST.ENTERTAIMENT:
            return './data/JSON/api_google_entertaiment.json'

        default:
            break;
    }
}


//need to get stores sort them how?
// stores convenience_store,furniture_store,home_goods_store,supermarket,shoe_store,shopping_mall,store
// hotels -> lodging
//entertaiment --> movie_theater,museum,night_club,art_gallery,tourist_attraction,
// resturants + cafe +?
// wellenss, gym, hair, massage and what more?, beauty_salon,gym,hair_care,florist,physiotherapist
// experience: ? art_gallery,tourist_attraction,


// väster 57.780632, 14.154856
// öster 57.779667, 14.181839
// kålgården  57.773565, 14.179455
// söder 57.771654, 14.149068
// solåsen 57.761732, 14.178252
// asecs 57.770144, 14.199983


const PINS = [
    { // väster 57.780632, 14.154856
        latitude: 57.780632,
        longitude: 14.154856,
        radius: 1800,
        request: [{
            categories: 'lodging',
            interestType: INTEREST.HOTELS
        }, {
            categories: 'store',
            interestType: INTEREST.STORES
        }, {
            categories: 'supermarket',
            interestType: INTEREST.STORES
        }, {
            categories: 'convenience_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'restaurant',
            interestType: INTEREST.RESTURANTS
        }, {
            categories: 'cafe',
            interestType: INTEREST.RESTURANTS
        }, {
            categories: 'movie_theater',
            interestType: INTEREST.ENTERTAIMENT,
        }, {
            categories: 'museum',
            interestType: INTEREST.ENTERTAIMENT,
        }, {
            categories: 'tourist_attraction',
            interestType: INTEREST.ENTERTAIMENT,
        }, {
            categories: 'beauty_salon',
            interestType: INTEREST.WELLNESS
        }, {
            categories: 'gym',
            interestType: INTEREST.WELLNESS
        }, {
            categories: 'physiotherapist',
            interestType: INTEREST.WELLNESS
        }]


    }, { // öster 57.779667, 14.181839
        latitude: 57.779667,
        longitude: 14.181839,
        radius: 1800,
        request: [{
            categories: 'lodging',
            interestType: INTEREST.HOTELS
        }, {
            categories: 'store',
            interestType: INTEREST.STORES
        }, {
            categories: 'supermarket',
            interestType: INTEREST.STORES
        }, {
            categories: 'convenience_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'restaurant',
            interestType: INTEREST.RESTURANTS
        }, {
            categories: 'cafe',
            interestType: INTEREST.RESTURANTS
        }, {
            categories: 'movie_theater',
            interestType: INTEREST.ENTERTAIMENT,
        }, {
            categories: 'museum',
            interestType: INTEREST.ENTERTAIMENT,
        }, {
            categories: 'tourist_attraction',
            interestType: INTEREST.ENTERTAIMENT,
        }, {
            categories: 'beauty_salon',
            interestType: INTEREST.WELLNESS
        }, {
            categories: 'gym',
            interestType: INTEREST.WELLNESS
        }, {
            categories: 'physiotherapist',
            interestType: INTEREST.WELLNESS
        }]

    },
    { // solåsen 57.761732, 14.178252
        latitude: 57.761732,
        longitude: 14.178252,
        radius: 1500,
        request: [{
            categories: 'supermarket',
            interestType: INTEREST.STORES
        }, {
            categories: 'store',
            interestType: INTEREST.STORES
        }, {
            categories: 'gym',
            interestType: INTEREST.WELLNESS
        }]
    }, { //asecs 57.770144, 14.199983
        latitude: 57.770144,
        longitude: 14.199983,
        radius: 1800,
        request: [{
            categories: 'store',
            interestType: INTEREST.STORES
        }, {
            categories: 'shopping_mall',
            interestType: INTEREST.STORES
        }, {
            categories: 'restaurant',
            interestType: INTEREST.RESTURANTS,
        }, {
            categories: 'cafe',
            interestType: INTEREST.RESTURANTS,
        }, {
            categories: 'beauty_salon',
            interestType: INTEREST.WELLNESS
        }, {
            categories: 'hair_care',
            interestType: INTEREST.WELLNESS
        }]


    },
];




module.exports = {
    INTEREST,
    PINS,
    getFileName,
};