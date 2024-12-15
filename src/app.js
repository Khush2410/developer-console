const express = require('express');

const app = express();

app.use("/test",(req,res)=>{
    res.send("Hello from test route");
})

app.use("/hello",(req,res)=>{
    res.send("Hello from hello route");
})

app.use("/",(req,res)=>{
    res.send("Hello from server");
})

app.listen(7777,()=>{
    console.log("connected to server successfully");
})