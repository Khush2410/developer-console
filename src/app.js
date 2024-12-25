const express = require('express');
const app = express();
const connectDB = require("./config/database")
const {adminAuth, userAuth} = require("./middlewares/auth")
const User = require("./models/user");


app.use(express.json());

// app.all("/user",function(req,res,next){
//     console.log("user api called");
//     next();
// })

app.post("/signup",(req,res)=>{
    const user = new User(req.body)

    try{
        user.save();
        res.send("User saved Successfully");
    }
    catch(err){
        res.status(400).send("Error saving user");
    }
})

app.get("/user", async (req,res)=>{
    const email = req.body.email;

    try{
        const users = await User.findOne({email : email});
        if(users.length == 0){
            res.status(404).send("user not found");
        }
        else {
            res.send(users);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})


app.get("/feed", async (req,res)=>{

    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.delete("/user",async (req,res)=>{
    const userId = req.body.userId;

    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.patch("/user",async (req,res)=>{
    const userId = req.body.userId;
    const data = req.body;

    try{
        await User.findByIdAndUpdate({_id : userId},data);
        res.send("user updated successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

connectDB().then(()=>{
    console.log("Database connection established")
    app.listen(7777,()=>{
        console.log("connected to server successfully");
    })
})
.catch((err)=>{
    console.log("Database not connected!!",err)
})


// Authentication code
// app.use("/admin",adminAuth);

// app.get("/admin/getAllData",(req,res)=>{
//     res.send("sent all data");
// });

// app.get("/user",userAuth,(req,res)=>{
//     res.send("user data sent");
// });


//Error Handling
//Normally best practice to use try catch
// app.get("/getUserData",(req,res)=>{
//     try {
//         throw new Error("error occured")
//     }
//     catch(err){
//         res.status(500).send("Something went wrong, please try again later")
//     }
// })

// //always use this case at last of your code
// //wildcard error handling
// app.use("/",(err,req,res,next)=>{
//     if(err){
//         res.status(500).send("something went wrong");
//     }
// })

