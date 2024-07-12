const User = require("../models/user");
const mailSender = require("../utils/mailSender")


exports.resetPassword = async(req,res)=>{
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
        token:token,
        resetPasswordTokenExpiry:Date.now()+5*60*1000
    },{new:true})

    const url = `https://localhost:3000/update-password/${token}`

    const title = 'Password reset link for your StudyNotion acoount'
    await mailSender(email,title,url)

    return res.status(200).json({
        message:"Password reset link sent to your email",
        success:true
    })
   }
   catch(err){
    console.log(err)
    return res.status(400).json({
        message:"Error in reset password controller",
        success:false
    })
   }
}