"use strict";
const calls = require('./api_calls')
const axios = require(`axios`)
const fs = require('fs')
const filePath = './data/JSON/'
const _ = require('lodash');

async function fetchData(url) {
    try {
        console.log(url)
        const response = await axios.get(url);

        if (!response) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        return await response.data;

    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
    }
}


// restriction for supermarket = Netto and Chili Basilika continue

async function createJSONData(data, restrictions) {
    const newJSONData = [];
    for (const feature of data.features) {
        const { properties } = feature;
        if (restrictions.includes(properties.name)) {
            continue;
        }


        const processedData = {
            name: properties.name,
            url: properties.datasource.raw.website || 'unknown',
            district: properties.suburb,
            address: properties.address_line2,
            shopType: properties.datasource.raw.shop || 'unknown',
            openingHours: properties.datasource.raw.opening_hours || 'unknown',
            coordinates: {
                longitude: properties.lon,
                latitude: properties.lat,
            }
        }
        newJSONData.push(processedData)


    }
    return newJSONData
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

function isNotDataEqual(oldData, newData) {
    return !_.isEqual(oldData, newData);
}

function mergeData(oldData, newData) {
    console.log('Data is different: ', _.differenceWith(newData, oldData, _.isEqual));
    return _.merge({}, oldData, _.differenceWith(newData, oldData, _.isEqual))
}

function mergeDataWithoutDuplicates(oldData, newData) {
    const mergedData = {};

    // Custom comparison function focusing on specific properties:
    const compareObjects = (obj1, obj2) => obj1.id === obj2.id && obj1.name === obj2.name;

    // Iterate through newData and add unique values to mergedData:
    for (const item of newData) {
        if (!Object.values(mergedData).some(existingItem => compareObjects(item, existingItem))) {
            mergedData[item.id] = item; // Use unique identifier (e.g., "id") as key
        }
    }
    Object.assign(mergedData, oldData);

    return mergedData;
}

function hasDataValue(data) {
    return data !== undefined &&
        data !== null &&
        Object.keys(data).length > 0;
}


/*works to create one, should now add for updates aswell and try to make the data from api match the stores data*/
async function functionTEST() {
    const call = calls.API_URL.SUPERMARKETS;
    const thisFilePath = await filePath + calls.getFileName(call)
    const dataFromAPI = await fetchData(call)
    const processedData = await createJSONData(dataFromAPI, calls.getRestriction(call))
    const oldData = await readFileData(thisFilePath)
    if (hasDataValue(oldData)) {
        console.log('there exist data')

    } else {
        console.log('there is no data')
        writeDataToFile(thisFilePath, processedData)
    }
}

async function functionTestMalls() {
    const call = calls.API_URL.STORES;
    const thisFilePath = await filePath + calls.getFileName(call)
    const dataFromAPI = await fetchData(call)
    const processedData = await createJSONData(dataFromAPI, calls.getRestriction(call))
    const oldData = await readFileData(thisFilePath)
    if (hasDataValue(oldData)) {
        if (isNotDataEqual(oldData, processedData)) {
            const updateData = await mergeData(oldData, processedData)
            writeDataToFile(thisFilePath, updateData)
        }

    } else {
        writeDataToFile(thisFilePath, processedData)
    }
}
//functionTEST()
//functionTestMalls()
async function runAPI() {
    Object.entries(calls.API_URL).forEach(async ([category, url]) => {
        const thisFilePath = await filePath + calls.getFileName(url);
        const dataFromAPI = await fetchData(url);
        const processedData = await createJSONData(dataFromAPI, calls.getRestriction(url));
        const oldData = await readFileData(thisFilePath);

        if (hasDataValue(oldData)) {
            if (isNotDataEqual(oldData, processedData)) {
                const updateData = await mergeData(oldData, processedData);
                writeDataToFile(thisFilePath, updateData);
            }

        } else {
            writeDataToFile(thisFilePath, processedData);
        }

    });
}


runAPI()