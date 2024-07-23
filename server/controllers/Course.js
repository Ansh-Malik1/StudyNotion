const { populate } = require("dotenv")
const Course = require("../models/Course")
const Tags = require("../models/Tags")
const User = require("../models/User")
const { uploadToCloudinary } = require("../utils/imageUploader")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")
require("dotenv").config()


exports.createCourse = async (req,res)=>{
    try{
        const {courseName,courseDescription,whatYouWillLearn,price,tag} = req.body
        console.log("CourseController",req.files)
        const thumbnail = req.files.thumbnailImage
        const userId = req.user.id
        console.log("ID :" ,userId)
        if(!courseName || !courseDescription || !whatYouWillLearn || !price 
           // || !tag || !thumbnail
        ){
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


exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        // .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }


  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }

  exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        //.populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      // const studentsEnrolled = course.studentsEnrolled
      // for (const studentId of studentsEnrolled) {
      //   await User.findByIdAndUpdate(studentId, {
      //     $pull: { courses: courseId },
      //   })
      // }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }