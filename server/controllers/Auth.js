const User = require('../models/User')
const OTP = require('../models/OTP')
const otpGenerator = require("otp-generator")
const Profile = require('../models/Profile')
const jwt = require('jsonwebtoken')
require("dotenv").config()
exports.sendotp = async (req,res)=>{
    try{

    }
    catch(err){
        console.log("Error in OTP generating")
        console.log(err)
        process.exit(1)
    }
    const {email} = req.body
    const checkUserPresent  =  await User.findone({email})
    if(checkUserPresent){
        return res.status(400).json({
            message:"User already present",
            success:false
        })
    }

    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log("OTP Generated")
    console.log(otp)
    const result = await OTP.findOne({otp:otp})
    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result = await OTP.findOne({otp:otp})
    }

    const otpPayload = {email,otp}

    const otpBody = await OTP.create(otpPayload)
    console.log(otpBody)

    return res.status(200).json({
        success:true,
        message:"OTP send successfully"
    })
}


exports.signUp = async(req,res)=>{
    try{
        const{
            firstName,
            lastName,
            email,
            contact,
            accountType,
            password,
            confirmPassword,
            otp
        } = req.body
    
        if(!firstName || !lastName || !email || !password || !confirmPassword){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }
    
        if(password!==confirmPassword){
            return res.status(402).json({
                success:false,
                message:"Password and Confirm Password does not match"
            })
        }
    
        const currentUser = await User.findOne({email})
        if(currentUser){
            return res.status(402).json({
                success:false,
                message:"Email already exists"
            })
        }
    
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1)
        if(recentOtp.length==0){
            return res.status(402).json({
                success:false,
                message:"OTP not found"
            })
        }
    
        else if(otp!=recentOtp){
            return res.status(402).json({
                success:false,
                message:"Invalid OTP"
            })
        }
    
        const hashedPass = await bcrypt.hash(password,10)
        
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contact:null
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            contact,
            password:hashedPass,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebar.com/5.x/initials/svg?seed={$firstname} ${lastName}`
    
        })
        return res.status(200).json({
            success:true,
            message:"SignUp successful",
            user
        })
    }
    catch(err){
        console.log("Error in signup")
        console.log(err)
        process.exit(1)
    }
}


exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide email and password"
            })
        }
        const userExist = await User.findone({email:email})
        if(!userExist){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            })
        }
        const isMatch = await bcrypt.compare(password,userExist.password)
        if(isMatch){
            const payload = {
                email:userExist.email,
                id:userExist._id,
                accountType:userExist.accountType
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expires:'4h'
            })
            userExist.token = token
            userExist.password = undefined

            const options = {
                expires: new Date(Date.now()+3*34*60+60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                userExist,
                message:"LoggedIn"
            })
        }
        else{
            return res.status(401).json({
                success:true,
                message:"Password is incorrect"
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(200).json({
            success:false,
            message:"Login Failed"
        })
    }
}


exports.changePassword = async (req,res)=>{
    //get data from body
    //get old pass, new pass, confirm pass
    //validation
    //update pwd in DB
    //send mail-> Password changed
    //return response
}
