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
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.set('location', `${latitude},${longitude}`);
    url.searchParams.set('radius', radius);
    url.searchParams.set('key', API_KEY_GOOGLE);
    url.searchParams.set('type', categories);
    url.searchParams.set('max_results', '60');

    //what happens if you get multiple pages?
    try {
        const response = await axios.get(url);

        if (response.status !== 200) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        return await response.data;
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        return [];
    }
}

async function getPlaceDetails(placeId) {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('key', API_KEY_GOOGLE);

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

async function getSublocality(addressComponents) {
    // Find the sublocality component using Lodash's find method
    const sublocalityComponent = _.find(addressComponents, (component) =>
        component.types.includes('sublocality') || component.types.includes('sublocality_level_1')
    );

    return sublocalityComponent ? sublocalityComponent.long_name : 'Unknown';
}

async function processData(placesAroundPin, INTEREST) {
    const processData = [];
    for (const place of placesAroundPin.results) {
        const details = await getPlaceDetails(place.place_id);
        if (details) {
            const dataObject = {
                google_id: place.place_id,
                name: details.result.name,
                address: details.result.formatted_address,
                district: await getSublocality(details.result.address_components),
                openingHours: details.result.opening_hours ? details.result.opening_hours.weekday_text : 'Unknown',
                website: details.result.website || 'None',
                description: details.result.editorial_summary ? details.result.editorial_summary.overview : 'No description available',
                contactPhoneNumber: details.result.international_phone_number || 'No contact information available',
                coordinates: {
                    longitude: details.result.geometry.location.lng,
                    latitude: details.result.geometry.location.lat,
                },
                linkGoogleMaps: details.result.url,
                interestType: INTEREST,
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
                console.log('UPDATE OLD DATA WITH NEW');
                oldData[oldIndex] = newObj;
            } else {
                console.log('ADD NEW DATA TO OLD');
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


async function loadGoogleAPI() {
    for (pin of CALL.PINS) {
        for (request of pin.request) {
            const pathFile = await CALL.getFileName(request.interestType);
            const oldData = await readFileData(pathFile);
            const placesAroundPin = await getPlacesAroundPoint(pin.latitude, pin.longitude, pin.radius, request.categories);
            const newData = await processData(placesAroundPin, request.interestType);
            if (hasDataValue(oldData)) {
                const updateData = await updateDataMerge(oldData, newData);
                writeDataToFile(pathFile, updateData);
            } else {
                writeDataToFile(pathFile, newData);
            }

        }
    }
}

loadGoogleAPI();



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


  
   */