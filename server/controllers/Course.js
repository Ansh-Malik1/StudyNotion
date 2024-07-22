const { populate } = require("dotenv")
const Course = require("../models/Course")
const Tags = require("../models/Tags")
const User = require("../models/User")
const { uploadToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()


exports.createCourse = async (req,res)=>{
    try{
        const {courseName,courseDescription,whatYouWillLearn,price,tag} = req.body
        console.log("CourseController",req.files)
        const thumbnail = req.files.thumbnailImage
        const userId = req.user.id
        console.log("ID :" ,userId)
        if(!courseName || !courseDescription || !whatYouWillLearn || !price){
            return res.status(401).json({
                success:false,
                message:"Please fill all the fields"
            })
        }
        
        const instructorDetails = await User.findById({_id:userId})
               
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:'Instructor details not found'
            })
        }

        // const tagDetails = await Tags.findById(tag)
        // if(!tagDetails){
        //     return res.status(400).json({
        //         success:false,
        //         message:'Tag details not found'
        //     })
        // }

        const uploadedImage = await uploadToCloudinary(thumbnail,process.env.FOLDER_NAME)

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            instructor:instructorDetails._id,
            tags:tag,
            thumbnail:uploadedImage.secure_url
        })

        await User.findByIdAndUpdate({_id:instructorDetails._id},{
            $push:{
                courses:newCourse._id
            },
        },{new:true})

        //Update tag schema
        
        return res.status(200).json({
            success:true,
            message:"Course created Successfully",
            data:newCourse
        })

    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error in createCourse controller",
            error:err.message
        })
    }
}



exports.getAllCourses = async(req,res)=>{
    try{
        const courses = await Course.find({},{courseName:true,
                                            price:true,
                                            thumbnail:true,
                                            instructor:true,
                                            tags:true,
                                            ratingAndReviews:true,
                                            studetsEnrolled:true
        })
        return res.status(200).json({
            success:true,
            message:"Courses fetched successfully",
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error in fetching all courses"
        })
    }
}

exports.getCourseDetails = async(req,res)=>{
    try{
        const {courseId} = req.body
        const courseDetails = await Course.find({_id:courseId}).populate({
            path:"instructor",
            populate:{
                path:"additionalDetails"
            }
        }).populate("catrgory").populate("ratingAndReviews").populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec()

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"Course not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Course fetched successfully",
            data:courseDetails
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error in fetching course details"
        })
    }
}