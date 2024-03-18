"use strict";
const dotenv = require('dotenv').config();
if (dotenv.error) {
    console.error('Error loading .env file:', dotenv.error);
    process.exit(1);
}
const { API_KEY_GOOGLE, } = process.env;
const CALL = require('./api_pins_google');
const fs = require('fs');
const _ = require('lodash');
const axios = require('axios');

async function getPlacesAroundPoint(latitude, longitude, radius, categories) {
    let url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.set('location', `${latitude},${longitude}`);
    url.searchParams.set('radius', radius);
    url.searchParams.set('key', "AIzaSyCmq1UY4xR0fMiHl4LxdvAE3zqXexbBDCA");
    url.searchParams.set('type', categories);


    let allPlaces = [];
    let nextPageToken = null;
    let iterationCount = 0;
    const maxIterations = 7;
    do {
        try {
            const response = await axios.get(url);
            if (response.status !== 200) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            allPlaces.push(...response.data.results);
            //allPlaces = allPlaces.concat(response.data.results);
            console.log(response.data)
            console.log(response.data.next_page_token)
            nextPageToken = response.data.next_page_token;
            iterationCount++;

            if (nextPageToken && iterationCount < maxIterations) {
                url.searchParams.set('next_page_token', nextPageToken); // Set for next iteration
            } else {
                console.log('No more pages available or maximum iterations reached.');
            }
        } catch (error) {
            console.error(`Error fetching data: ${error.message}`);
            return [];
        }
    } while (nextPageToken && iterationCount < maxIterations);
    console.log(allPlaces.length);
    return await allPlaces;
}
async function getPlacesAllAroundPoint(latitude, longitude, radius, categories) {
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.set('location', `${latitude},${longitude}`);
    url.searchParams.set('radius', radius);
    url.searchParams.set('key', "AIzaSyCmq1UY4xR0fMiHl4LxdvAE3zqXexbBDCA");
    url.searchParams.set('type', categories); // Set desired category filters
    url.searchParams.set('max_results', '200');

    const results = [];
    let nextPageToken = '';

    do {
        url.searchParams.set('pagetoken', nextPageToken); // Add pagetoken for subsequent requests

        try {
            const response = await axios.get(url);

            if (response.status !== 200) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            results.push(...response.data);
            nextPageToken = response.data.next_page_token;
        } catch (error) {
            console.error(`Error fetching data: ${error.message}`);
            break; // Exit the loop on errors
        }
    } while (nextPageToken);
    console.log(results);
    return await results;
}

async function getPlaceDetails(placeId) {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('key', "AIzaSyCmq1UY4xR0fMiHl4LxdvAE3zqXexbBDCA");

    //make this better, question if you need restriction 
    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return await response.data;

    } catch (error) {
        console.error(`Error fetching details: ${error.message}`);
        return {};
    }
}

async function getSublocality(addressComponents, PLACENAME) {
    // Find the sublocality component using Lodash's find method
    console.log(addressComponents);
    const sublocalityComponent = await _.find(addressComponents, (component) =>
        component.types.includes('sublocality') || component.types.includes('sublocality_level_1')
    );

    return sublocalityComponent ? sublocalityComponent.long_name : PLACENAME;
}

async function processData(placesAroundPin, INTEREST, PLACENAME) {
    const processData = [];
    for (const place of placesAroundPin) {
        const details = await getPlaceDetails(place.place_id);
        if (details) {
            const dataObject = {
                google_id: place.place_id,
                name: details.result.name,
                address: details.result.formatted_address,
                district: await getSublocality(details.result.address_components, PLACENAME),
                openingHours: details.result.opening_hours ? details.result.opening_hours.weekday_text : 'Unknown',
                website: details.result.website || 'None',
                description: details.result.editorial_summary ? details.result.editorial_summary.overview : 'No description available',
                contactPhoneNumber: details.result.international_phone_number || 'No contact information available',
                coordinates: {
                    longitude: details.result.geometry.location.lng,
                    latitude: details.result.geometry.location.lat,
                },
                linkGoogleMaps: details.result.url,
                interestType: [INTEREST],
            }
            processData.push(dataObject);
        }
    }
    return await processData;
}

async function readFileData(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.log('file dosent exsit')
            return [];
        }
        const data = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
        return [];
    }
}

function writeDataToFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { flag: 'w' });
        console.log("Data has been updated")
    } catch (error) {
        console.error(`Error writing data to file ${filePath}: ${error.message}`);
    }
}

async function updateDataMerge(oldData, newData) {
    if (_.isArray(oldData) && _.isArray(newData)) {
        _.forEach(newData, (newObj) => {
            const oldObj = _.find(oldData, (item) => _.isEqual(item.google_id, newObj.google_id));
            const oldIndex = _.findIndex(oldData, (item) => _.isEqual(item.google_id, newObj.google_id));

            if (oldObj) {
                //uppdaterar intrestype så ett object kan ha fler instrestype
                const newInterest = newObj.interestType[0];
                if (!oldObj.interestType.includes(newInterest)) {
                    oldData[oldIndex].interestType.push(newInterest);
                };
            } else {
                //lägger till nya obj i listan
                oldData.push(newObj);
            }
        });

        return await oldData;
    } else {
        console.log("UPDATE FUNCTION IS NOT UPDATING")
    }
}

function hasDataValue(data) {
    return data !== undefined &&
        data !== null &&
        Object.keys(data).length > 0;
}

async function updateData(placesAroundPin, interestType, placeName) {
    const pathFile = 'backend/data/JSON/api_google_allData.json';
    const oldData = await readFileData(pathFile);
    const newData = await processData(placesAroundPin, interestType, placeName);
    if (hasDataValue(oldData)) {
        const updateData = await updateDataMerge(oldData, newData);
        writeDataToFile(pathFile, updateData);
    } else {
        writeDataToFile(pathFile, newData);
    }

}


async function loadGoogleAPI() {
    for (let pin of CALL.PINS) {
        for (let request of pin.request) {
            const placesAroundPin = await getPlacesAroundPoint(pin.latitude, pin.longitude, pin.radius, request.categories);
            await updateData(placesAroundPin, request.interestType, pin.name);
        }
    }
}

loadGoogleAPI();
// rows last time 7102 and then -> 8916
//DENNA SKA BARA KÖRAS OM DET INTE FINNS NÅGON JSON FIL!!
// TAR 1000år att ladda..
//UPDATERA SEN BARA ENSKILDA OBJECT MEN VAD SOM BEHÖVS INTE ALLT!!!!


/*
   const detailedPlaces = [];
   for (const place of placesAroundPin) {
       const details = await getPlaceDetails(place.place_id);
       //console.log(details)

       if (details) {
           // Extract desired information
           const district = details.address_components[2].long_name || 'unknown'
           const name = details.name
           const businessType = 'Hotels'; // Assuming the first type is the business type
           const openingHours = details.opening_hours ? details.opening_hours.weekday_text : 'Unknown'; // An week list of opening hours
           const website = details.website || 'None';
           const googleMaps = details.url;
           const address = details.formatted_address;
           const description = details.editorial_summary ? details.editorial_summary.overview : 'No description available';
           const contactInfo = details.international_phone_number || 'No contact information available';
           const coordinates = {
               longitude: details.geometry.location.lat,
               latitude: details.geometry.location.lon,
           }
           console.log(`District = ${district}`)
           console.log(`Name = ${name}`)
           console.log(`Opening hours = ${openingHours}`)
           console.log(`website = ${website}`)
           console.log(`addres = ${address}`)
           console.log(`Description = ${description}`)
           console.log(`Contact info = ${contactInfo}`)
           console.log(`Coordinates = ${coordinates}`)
           console.log('\n')

       }



   }

   async function test() {
    const pin = {
        latitude: 57.780632,
        longitude: 14.154856,
        radius: 700,
        categories: 'lodging',

    };
    const oldData = await readFileData(CALL.getFileName(CALL.INTEREST.HOTELS));
    const placesAroundPin = await getPlacesAroundPoint(pin.latitude, pin.longitude, pin.radius, pin.categories);
    const newData = await processData(placesAroundPin, CALL.INTEREST.HOTELS);
    console.log(oldData);
    console.log(newData);
    if (hasDataValue(oldData)) {
        const mergeData = await updateDataMerge(oldData, newData);
        writeDataToFile(CALL.getFileName(CALL.INTEREST.HOTELS), mergeData);
    }
}
test();

why can i loop throug pages? if (pin.name === CALL.PLACENAME.VÄSTER && request.categories === 'store' || pin.name === CALL.PLACENAME.ÖSTER && request.categories === 'store' || pin.name === CALL.PLACENAME.ASECS && request.categories === 'store') {
                const placesAroundPin = await getPlacesAllAroundPoint(pin.latitude, pin.longitude, pin.radius, request.categories);
                await updateData(placesAroundPin, request.interestType, pin.name);
            } else {
                const placesAroundPin = await getPlacesAroundPoint(pin.latitude, pin.longitude, pin.radius, request.categories);
                await updateData(placesAroundPin, request.interestType, pin.name);
            }
  
   */

async function test() {
    const pin = {
        latitude: 57.780632,
        longitude: 14.154856,
        radius: 2500,
        categories: 'restaurant',

    };
    const placesAroundPin = await getPlacesAroundPoint(pin.latitude, pin.longitude, pin.radius, pin.categories);
    const a = await processData(placesAroundPin)
}


//test();