const express = require("express");
const authRouter = express.Router();
const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req,res)=>{
    try{
        //validations on req.body
        validateSignupData(req);

        const {firstName, lastName, email, password} = req.body;

        // encrypt the password
        const passwordHash = await bcrypt.hash(password,10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        })
        await user.save();
        res.send("User saved Successfully");
    }
    catch(err){
        res.status(400).send("Error saving user" + err.message);
    }
})

authRouter.post("/login", async (req,res)=>{
    
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email : email});
        if(!user){
            throw new Error("Invalid Credentials");
        }
    
        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid){
            throw new Error("Invalid Credentials");
        }
        else {
            //generate a cookie
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send("Login Successful");
        }
    } catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("Logout successful");
})

module.exports = authRouter;