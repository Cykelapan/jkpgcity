const validate = require(`validator`);
const _ = require('lodash');

const inJSONlogin = {
    username: String,
    password: String,
};
const nameFileds = [
    "username", "password"
]

async function createValidData(inDataJSON) {
    return {
        username: inDataJSON.username,
        password: inDataJSON.password
    }
};

const loginValidate = async (inDataJSON) => {
    let validationErrors = [];
    const missingFields = _.difference(nameFileds, _.keys(inDataJSON));
    console.log(missingFields);

    if (missingFields.length > 0) {
        validationErrors.push(`Missing required fields: ${missingFields}`);
        return {
            haveErrors: validationErrors.length > 0, // True if no errors, False otherwise
            errors: validationErrors, // Array of error messages
        };
    }

    if (!validate.isLength(inDataJSON.username, { min: 4, max: 20 })) {
        validationErrors.push("Username must be 4-20 characters long.");
    }
    if (!validate.isLength(inDataJSON.password, { min: 8, max: 20 })) {
        validationErrors.push("Password weak!");
    }

    const validData = await createValidData(inDataJSON);
    return {
        haveErrors: validationErrors.length > 0, // True if no errors, False otherwise
        errors: validationErrors, // Array of error messages
        validData: validData
    };
};


module.exports = loginValidate