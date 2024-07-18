const RnR = require("../models/RatingAndReview")
const User = require("../models/User")
const Course = require("../models/Course")
const RatingAndReview = require("../models/RatingAndReview")
const { default: mongoose } = require("mongoose")

exports.createRating = async(req,res)=>{
    try{
        const userId = req.user.id
        const {rating,review,courseId} = req.body
        
        const courseDetails = await Course.findOne({_id:courseId,studentsEnrolled:{$eleMatch:{$eq:userId}}})

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"You are not enrolled in this course"
            })
        }
        const alreadyReviewed = await RnR.findOne({user:userId,course:courseId})

        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"You have already reviewed this course"
            })
        }

        const RnRpayload = await RnR.create({
            user:userId,
            course:courseId,
            rating:rating,
            review:review
        })

        await Course.findByIdAndUpdate({_id:courseId},{
            $push:{ratingsAndReviews:RnRpayload._id}
        },{new:true})

        return res.status(200).json({
            success:true,
            message:"Rating and review added successfully",
            RnRpayload
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error in adding ratings and reviews"
        })
    }
}


exports.getAverageRating = async(req,res)=>{
    try{
        const {courseId} = req.body

        const result = await RatingAndReview.aggregate([{
            $match:{course: new mongoose.Types.ObjectId(courseId)}
        },
        {
            $group:{
                _id:null,
                averageRating:{$avg:"$rating"}
            }
        }
    ])
    if(result){
        return res.status(200).json({
            success:true,
            message:"Average rating of the course",
            answer:result[0].averageRting
        })
    }

    return res.status(200).json({
        success:true,
        message:"No ratings and reviews found for this course",
        answer:0
    })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error in finding average rating"
        })
    }
    
}



exports.getAllRatings = async(req,res)=>{
    try{
        const allReviews = RnR.find({}).sort({rating:'desc'}).populate({
            path:'user',
            select:'firstName lastaName email image'
        }).populate({
            path:'course',
            select:'courseName'
        }).exec()

        return res.status(200).json({
            success:true,
            message:"All ratings and reviews",
            data:allReviews
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error in finding ratings"
        })
    }

}