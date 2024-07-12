const mongoose = require("mongoose")


const reviewAndRating = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true
    }
})

module.exports = mongoose.Schema("RatingsAndReviews",reviewAndRating)