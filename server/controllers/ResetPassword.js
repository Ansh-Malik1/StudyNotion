const User = require("../models/User");
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")

exports.resetPasswordToken = async(req,res)=>{
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

exports.resetPassword = async (req,res)=>{
    try{
        const {password,confirmPassword,token} = req.body

        if(password!==confirmPassword){
            return res.status(400).json({
                message:"Password and confirm password do not match",
                success:false
            })
        }

        const userDetails = User.findOne({token:token})
        if(!userDetails){
            return res.status(400).json({
                message:"Invalid token",
                success:false
            })
        }
        if(userDetails.resetPasswordTokenExpiry>Date.now()){
            return res.status(400).json({
                message:"Token expired",
                success:false
            })
        }
        const hashedPass = bcrypt.hash(password,10)

        await User.findOneAndUpdate({token:token},{
            password:hashedPass,
        },{new:true})

        return res.status(200).json({
            message:"Password reset successfully",
            success:true
        })
    }
    catch(error){
        console.log(error)
        return res.status(400).json({
            message:"Error in reset password controller",
            success:false
        })
    }
}