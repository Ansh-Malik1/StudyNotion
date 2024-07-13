const Profile =  require("../models/Profile")

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


// get user details