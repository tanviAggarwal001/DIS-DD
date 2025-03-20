const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_CONN

mongoose.connect(mongo_url)
.then(()=>{
    console.log("MONGO DB connected...");}).catch((err)=>{
        console.log("Mongo connection error" , err);
    })

module.exports = mongoose
