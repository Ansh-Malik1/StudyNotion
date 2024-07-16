const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async(req,res)=>{
    try{
        const {sectionName,courseId} = req.body
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Please provide all the required fields"
            })
        }
        const newSection =  await Section.create({sectionName})
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent:newSection._id
            }
        },{new:true})

        return res.status(200).json({
            sucess:true,
            message:"Section created successfully",
            updatedCourseDetails
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Something went wrong while creating the section"
        })
    }
}

exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);
		res.status(200).json({
			success: true,
			message: section,
		});
	} 
	catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

exports.deleteSection = async (req,res)=>{
    try{
        const {sectionId} = req.params
        await Section.findByIdAndDelete(sectionId)
        return res.status(200).json({
            sucess:true,
            message:"Section deleted successfully",
            updatedSection
        })

    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Something went wrong while deleting the section"
        })
    }
}