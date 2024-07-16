const mongoose = require('mongoose')

const profileSchema  = new  mongoose.Schema({
    gender:{
        type:String,
        enum:["Male","Female","Others"]
    },
    dateOfBirth:{
        type:String
    },
    about:{
        type:String,
        trim:true
    },
    contact:{
        type:Number,
        trim:true
    }
})

module.exports = mongoose.Schema("Profile",profileSchema)