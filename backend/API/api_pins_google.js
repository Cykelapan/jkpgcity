"use strict";

const INTEREST = {
    STORES: 'stores',
    WELLNESS: "wellness",
    RESTURANTS: 'resturants',
    HOTELS: 'accommodation',
    ENTERTAIMENT: 'entertaiment'
}

const PLACENAME = {
    VÄSTER: 'Väster',
    ÖSTER: 'Öster',
    TÄNDSTICKSOMRÅDET: 'Tändsticksområdet',
    PIREN: 'Piren',
    SÖDER: 'Söder'
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
        // 57.785957, 14.159194
        name: PLACENAME.TÄNDSTICKSOMRÅDET,
        latitude: 57.785957,
        longitude: 14.159194,
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
        }, {
            categories: 'movie_theater',
            interestType: INTEREST.ENTERTAIMENT,
        }]
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
        //57.781647, 14.158387
        name: PLACENAME.VÄSTER,
        latitude: 57.781647,
        longitude: 14.158387,
        radius: 650,
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
        }, {
            categories: 'drugstore',
            interestType: INTEREST.STORES
        }, {
            categories: 'clothing_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'supermarket',
            interestType: INTEREST.STORES
        }, {
            categories: 'furniture_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'book_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'convenience_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'shoe_store',
            interestType: INTEREST.STORES
        },
        ]


    }, { // öster 57.779667, 14.181839
        //57.781546, 14.179326
        name: PLACENAME.ÖSTER,
        latitude: 57.781546,
        longitude: 14.179326,
        radius: 650,
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
        }, {
            categories: 'drugstore',
            interestType: INTEREST.STORES
        }, {
            categories: 'clothing_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'supermarket',
            interestType: INTEREST.STORES
        }, {
            categories: 'furniture_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'book_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'convenience_store',
            interestType: INTEREST.STORES
        }, {
            categories: 'shoe_store',
            interestType: INTEREST.STORES
        },]

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
    }
];






module.exports = {
    INTEREST,
    PINS,
    PLACENAME
};