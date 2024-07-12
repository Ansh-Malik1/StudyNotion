const mongoose = require("mongoose")
require('dotenv').config()

exports.connect = ()=>{
    mongoose.connect({
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>console.log("DB Connected Successfully"))
    .catch((err)=>{
        console.log("DB Connection Failed")
        console.log(err)
        process.exit(1)
    })
}