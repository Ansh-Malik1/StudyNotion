const Tags = require("../models/Tags")

exports.createTag = async(req,res)=>{
    try{
        const {name , description} = req.body

        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"Please provide all the fields"
            })
        }

        const tagDetails =  await Tags.create({
            name:name,
            description:description
        })
        console.log(tagDetails)

        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            message:"Error in Tags controller",
            success:false
        })
    }
}


exports.getAllTags = async (req,res)=>{
    try{
        const allTags = await Tags.find({},{name:true,description:true})
        console.log(allTags)
        return res.status(200).json({
            success:true,
            message:"All Tags fetched successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            message:"Error in Tags controller",
            success:false
        })
    }
}