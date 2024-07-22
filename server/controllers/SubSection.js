const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const { uploadToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()
exports.createSubSection = async(req,res)=>{
    try{
        const {sectionId,title,timeDuaration,description} = req.body
        console.log(req.files)
        const video = req.files.video

        if(!sectionId || !title 
           // || !timeDuaration
           || !description){
            return res.status(400).json({message:"Please fill all the fields" ,success:false})
        }
        console.log(video)
        const uploadDetails = await uploadToCloudinary(video,process.env.FOLDER_NAME)
        const videoUrl = uploadDetails.secure_url

        const subSectionDetails = await SubSection.create({
            title:title,
            description:description,
            // timeDuration:timeDuaration,
            videoUrl:videoUrl
        })

        const updatedSection =  await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                subSection:subSectionDetails._id
            }
        },{new:true}).populate("subSection")
        
        return res.status(200).json({message:"SubSection created successfully",success:true,updatedSection})
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Something went wrong while creating the subsection"
        })
    }
}

exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, title, description } = req.body
      const subSection = await SubSection.findById(sectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      return res.json({
        success: true,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }
  
  exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }