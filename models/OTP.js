const mongoose = require('mongoose')
const mailSender = require('../utils/mailSender')

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})


// Function to send email:
async function sendVerificationMail(email,otp){
    try{
        const title = "Verification mail from StudyNotion"
        const mailResponse = await mailSender(email,title,otp)
        console.log(mailResponse)
    }
    catch(error){
        console.log("Error in sending mail")
        console.log(error)
        throw error
    }
}

otpSchema.pre("save",async function(next){
    await sendVerificationMail(this.email,this.otp)
    next()
})

module.exports = mongoose.model('OTP',otpSchema)