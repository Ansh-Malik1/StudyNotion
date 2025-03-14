const Profile =  require("../models/Profile")
const User = require("../models/User")
const {uploadImageToCloudinary} = require('../utils/imageUploader')
const mailSender = require("../utils/mailSender")
const Course = require("../models/Course")
exports.updateProfile = async(req,res)=>{
    try{
        const{gender,dateOfBirth="",about="",contact} = req.body
        const userId = req.user.id
        const email = req.user.email
        if(!contact || !gender || !userId){
            return res.status(400).json({message:"Please fill all the fields",success:false})
        }

        const userDetails = await User.findById(id)
        const profileId = userDetails.additionalDetails
        const updatedProfile = Profile.findByIdAndUpdate({_id:profileId},{
            $set:{
                gender:gender,
                datOfBirth:dateOfBirth,
                about:about,
                contact:contact
            } //Check if doesnt work
        })

        return res.status(200).json({
            message:"Profile updated successfully",
            success:true,
            updatedProfile
        })
        
       
    } 
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Something went wrong while updating the profile"
        })
    }
}


//delete account , mail sending -> clicking link -> new page -> confirmation -> delete
exports.deleteAccountToken = async (req,res)=>{
    try{
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false
            })
        }
    const token = crypto.randomUUID()
    const updatedDetails = await User.findOneAndUpdate({email:email},{
        deleteAccountToken:token,
        deleteAccountTokenExpiry:Date.now()+5*60*1000
    },{new:true})

    const url = `https://localhost:3000/update-password/${token}`
    const title="Account Deletion link for you StudyNotion account"
    await mailSender(email,title,url)

    return res.status(200).json({
        message:"Account deletion link sent to your email",
        success:true
    })

    }
    catch(err){
        return res.status(400).json({
            message:"Error in account delete token generating",
            success:false,
            error:err.message
        })
    }
}

exports.deleteAccount = async(req,res)=>{s
    try{
        const {token} = req.params
        const email = req.user.email
        const details = User.findOne({email:email})
        if(details.deleteAccountTokenExpiry>Date.now()){
            return res.status(400).json({
                message:"Link Expired",
                success:false
            })
        }
        await User.deleteOne({deleteAccountToken:token})
        
        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
    }
    catch(err){
        return res.status(400).json({
            message:"Couldn't delete the account",
            success:false,
            error:err.message
        })
    }
}

// get user details
exports.getAllUserDetails =  async(req,res)=>{
    try{
        const id = req.user.id
        const userDetails = await User.findById(id).populate("additionalDetails").exec()

        return res.status(200).json({
            success:true,
            userDetails:userDetails,
            message:"User details fetched successfully"
        })
    }
    catch(err){
        return res.status(400).json({
            message:"Couldn't fetch account details.",
            success:false,
            error:err.message
        })
    }
}


exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      console.log(userId)
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
            path: "courses",
            populate: {
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            },
          })
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};


exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}