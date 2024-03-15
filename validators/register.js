"use strict";
const validate = require(`validator`);
const _ = require('lodash');

const inJSONRegister = {
    username: String,
    password1: String,
    password2: String,
    email: String,
    fName: String,
    lName: String
};
const nameFileds = [
    "username", "password1", "password2", "email", "fName", "lName"
]

async function createValidData(inDataJSON) {
    return {
        fName: inDataJSON.fName,
        lName: inDataJSON.lName,
        email: inDataJSON.email,
        username: inDataJSON.username,
        password: inDataJSON.password1
    }
}

const validateRegister = async (inDataJSON) => {
    let validationErrors = [];

    //if (!validate.isJSON(inDataJSON)) {
    //    console.log("NOT JSON FORMAT")
    //
    //}
    const missingFields = _.difference(nameFileds, _.keys(inDataJSON));
    console.log(missingFields);

    if (missingFields.length > 0) {
        validationErrors.push(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (!validate.isEmail(inDataJSON.email)) {
        validationErrors.push("Invalid email format.");
    }

    if (!validate.isLength(inDataJSON.username, { min: 4, max: 20 })) {
        validationErrors.push("Username must be 4-20 characters long.");
    }
    if (inDataJSON.password1 === inDataJSON.password2) {
        if (!validate.isStrongPassword(inDataJSON.password1, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
        })) {
            validationErrors.push("Password weak!");
        }
    } else {
        validationErrors.push("Passwords do not match.");
    }

    const validData = await createValidData(inDataJSON);
    return {
        haveErrors: validationErrors.length > 0, // True if no errors, False otherwise
        errors: validationErrors, // Array of error messages
        validData: validData
    };
};


module.exports = validateRegister