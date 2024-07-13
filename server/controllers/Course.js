const Course = require("../models/Course")
const Tags = require("../models/Tags")
const User = require("../models/User")
const { uploadToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()


exports.createCourse = async (req,res)=>{
    try{
        const {courseName,courseDescription,whatYouWillLearn,price,tag} = req.body
        const thumbnail = req.files.thumbnailImage

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag){
            return res.status(401).json({
                success:false,
                message:"Please fill all the fields"
            })
        }
        const userId = req.user.userId
        const instructorDetails = await User.findById(userId)
        console.log(instructorDetails)
        
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:'Instructor details not found'
            })
        }

        const tagDetails = await Tags.findById(tag)
        if(!tagDetails){
            return res.status(400).json({
                success:false,
                message:'Tag details not found'
            })
        }

        const thumbnailImage = await uploadToCloudinary(thumbnail,process.env.FOLDER_NAME)

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            instructor:instructorDetails._id,
            tags:tag,
            thumbnail:thumbnailImage.secure_url
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
            message:"Error in createCourse controller"
        })
    }
}



exports.getAllcourses = async(req,res)=>{
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