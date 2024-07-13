const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const { uploadToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()
exports.createSubSection = async(req,res)=>{
    try{
        const {sectionId,title,timeDuaration,description} = req.body
        const video = req.files.videoFile

        if(!sectionId || !title || !timeDuaration || !description){
            return res.status(400).json({message:"Please fill all the fields" ,success:false})
        }
        const uploadDetails = await uploadToCloudinary(video,process.env.FOLDER_NAME)
        const videoUrl = uploadDetails.secure_url

        const subSectionDetails = await SubSection.create({
            title:title,
            description:description,
            timeDuration:timeDuaration,
            videoUrl:videoUrl
        })

        const updatedSection =  await Section.findeByIdAndUpdate({_id:sectionId},{
            $push:{
                subSection:subSectionDetails._id
            }
        },{new:true})
        
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