const {userAuth} = require("../middlewares/auth")
const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res) =>{

    try{
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Invalid status type " + status})
        }

        const existConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(existConnectionRequest){
            return res.status(400).send({message: "Connection Request Already Exists!"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();
        res.json({
            message: "Connection Request sent successfully",
            data
        })
    } catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = requestRouter;