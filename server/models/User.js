const mongoose = require('mongoose')

const userSchema  = new  mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        enum:["Admin","Instructor","Student"]
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile',
        required:true
    },
    courses:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    image:{
        type:String,
        required:true
    },
    courseProgress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CourseProgress'
    }
})

module.exports = mongoose.Schema("User",userSchema)