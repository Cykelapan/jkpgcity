"use strict";

const INTEREST = {
    STORES: 'stores',
    WELLNESS: 'wellness',
    RESTURANTS: 'resturants',
    HOTELS: 'accommodation',
    ENTERTAIMENT: 'entertaiment'
}

const PLACENAME = {
    VÄSTER: 'Väster',
    ÖSTER: 'Öster',
    SOLÅSEN: 'Solåsen',
    SÖDER: 'Söder',
    ASECS: 'Asecs',
    TÄNDSTICKSOMRÅDET: 'Tändsticksområdet',
    PIREN: 'Piren'

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
// 57.785713, 14.156878 to 100m
// 57.785342, 14.158601 to 100m
//57.784977, 14.159896 to 100m

const PINS = [
    {
        // 57.785383, 14.158439 to 100m
        name: PLACENAME.TÄNDSTICKSOMRÅDET,
        latitude: 57.785383,
        longitude: 14.158439,
        radius: 230,
        request: [{
            categories: 'store',
            interestType: INTEREST.STORES
        }, {
            categories: 'night_club',
            interestType: INTEREST.ENTERTAIMENT
        }, {
            categories: 'restaurant',
            interestType: INTEREST.RESTURANTS
        }, {
            categories: 'cafe',
            interestType: INTEREST.RESTURANTS
        }, {
            categories: 'museum',
            interestType: INTEREST.ENTERTAIMENT,
        }, {
            categories: 'tourist_attraction',
            interestType: INTEREST.ENTERTAIMENT,
        },]
    },
    {
        // //57.784655, 14.169145 -> piren 70m
        name: PLACENAME.PIREN,
        latitude: 57.785383,
        longitude: 14.158439,
        radius: 80,
        request: [{
            categories: 'restaurant',
            interestType: INTEREST.RESTURANTS
        }, {
            categories: 'night_club',
            interestType: INTEREST.ENTERTAIMENT
        },]
    },

    { // väster 57.780632, 14.154856
        //57.780858, 14.159219
        name: PLACENAME.VÄSTER,
        latitude: 57.780858,
        longitude: 14.159219,
        radius: 1200,
        request: [{
            categories: 'lodging',
            interestType: INTEREST.HOTELS
        }, {
            categories: 'night_club',
            interestType: INTEREST.ENTERTAIMENT
        }, {
            categories: 'park',
            interestType: INTEREST.ENTERTAIMENT
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
        }, {
            categories: 'store',
            interestType: INTEREST.STORES
        }]


    }, { // öster 57.779667, 14.181839
        //57.781254, 14.177045
        name: PLACENAME.ÖSTER,
        latitude: 57.781254,
        longitude: 14.177045,
        radius: 1200,
        request: [{
            categories: 'lodging',
            interestType: INTEREST.HOTELS
        }, {
            categories: 'night_club',
            interestType: INTEREST.ENTERTAIMENT
        }, {
            categories: 'park',
            interestType: INTEREST.ENTERTAIMENT
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
        }, {
            categories: 'store',
            interestType: INTEREST.STORES
        },]

    },
    /*
    { // solåsen 57.761732, 14.178252
        name: PLACENAME.SOLÅSEN,
        latitude: 57.761732,
        longitude: 14.178252,
        radius: 1500,
        request: [{
            categories: 'store',
            interestType: INTEREST.STORES
        }, {
            categories: 'gym',
            interestType: INTEREST.WELLNESS
        }, {
            categories: 'park',
            interestType: INTEREST.ENTERTAIMENT
        },]
    }, { //asecs 57.772049, 14.199010
        name: PLACENAME.ASECS,
        latitude: 57.772049,
        longitude: 14.199010,
        radius: 700,
        request: [{
            categories: 'store',
            interestType: INTEREST.STORES
        }, {
            categories: 'drugstore',
            interestType: INTEREST.STORES
        }, {
            categories: 'clothing_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'electronics_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'shoe_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'supermarket',
            interestType: INTEREST.STORES
        }, {
            categories: 'convenience_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'shopping_mall',
            interestType: INTEREST.STORES
        }, {
            categories: 'furniture_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'book_store',
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
    { //Söder 57.772609, 14.152337
        name: PLACENAME.SÖDER,
        latitude: 57.772609,
        longitude: 14.152337,
        radius: 800,
        request: [{
            categories: 'store',
            interestType: INTEREST.STORES
        }, {
            categories: 'supermarket',
            interestType: INTEREST.STORES
        }, {
            categories: 'restaurant',
            interestType: INTEREST.RESTURANTS,
        }, {
            categories: 'tourist_attraction',
            interestType: INTEREST.ENTERTAIMENT,
        }, {
            categories: 'cafe',
            interestType: INTEREST.RESTURANTS,
        }, {
            categories: 'park',
            interestType: INTEREST.ENTERTAIMENT
        },]
    },*/
];


async function getMaxSearch(category) {
    switch (category) {
        case 'store':
            return 200;
        case 'physiotherapist' || 'gym' || 'museum' || 'electronics_store' || 'hair_care' || 'beauty_salon':
            return 20;
        case 'supermarket' || 'convenience_store':
            return 10;
        case 'clothing_store' || 'shoe_store' || 'lodging':
            return 60;
        case 'shopping_mall' || 'movie_theater':
            return 5;
        case 'restaurant' || 'cafe' || 'tourist_attraction':
            return 100;
        default:
            return 5;
    }
};

//57.785533, 14.158831 -> tändsticks området 200/250m
//57.782129, 14.155344 -> väster området 400m
//57.780163, 14.162843 -> väster 400m
//57.781497, 14.155598 -> väster 320m
//57.782982, 14.159233 -> väster 200
//57.784655, 14.169145 -> piren 70m
//57.782164, 14.174242 -> öster 400m
//57.778964, 14.173292 -> öster 250m
//57.780999, 14.181215 -> öster 500m







module.exports = {
    INTEREST,
    PINS,
    getFileName,
    PLACENAME,
    getMaxSearch
};