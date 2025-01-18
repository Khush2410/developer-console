const validator = require("validator");

const validateSignupData = (req) =>{

    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is weak")
    }
}

const validateProfileEditData = (req)=>{
    const allowedEditFields = [
        "firstName",
        "lastName",
        "email",
        "about",
        "skills",
        "age",
        "gender"
    ]

    const isEditAllowed = Object.keys(req.body).every((key) => 
        allowedEditFields.includes(key))

    return isEditAllowed;
}

module.exports = {
    validateSignupData,
    validateProfileEditData
}