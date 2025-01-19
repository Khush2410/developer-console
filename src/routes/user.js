const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { connection } = require("mongoose");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl skills about"

userRouter.get("/user/requests/received", userAuth, async (req,res) =>{

    try{
        const loggedInUser = req.user;

        const data = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "skills", "about"])

        res.json({
            message: "Data fetched successfully",
            data: data
        })
    } catch(err){
        return res.status(400).send("Error : " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or : [
                {fromUserId: loggedInUser._id, status : "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)

        if(!connections){
            throw new Error("No connections found!")
        }

        console.log(connections);

        const data = connections.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        });

        res.json({data});

    } catch(err){
        return res.status(400).send({message : "Error : " + err.message});
    }
})

userRouter.get("/feed", userAuth, async (req,res) =>{
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id},{toUserId: loggedInUser._id}]
        }).select("fromUserId toUserId")

        console.log(connectionRequests);

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })
        console.log(hideUsersFromFeed);

        const users = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideUsersFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        res.send(users);


    } catch(err){
        res.status(400).send({message: "Error: " + err.message});
    }
})

module.exports = userRouter;