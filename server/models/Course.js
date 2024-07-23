const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
    whatYouWillLearn:{
        type:String
    },
    price:{
        type:Number
    },
    thumbnail:{
        type:String
    },
    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }],
    courseContent:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReviews"
        }
    ],
    status: {
		type: String,
		enum: ["Draft", "Published"],
        default:"Draft"
	},
    instructions: {
		type: [String],
	},
    tag: {
		type: [String],
		required: true,
	},
})

module.exports = mongoose.model("Course",courseSchema)