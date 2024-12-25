const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://khush241001:vI20xZO40ccqIxSq@namastenodejs.rpwud.mongodb.net/devConsole");
}

module.exports = connectDB;
