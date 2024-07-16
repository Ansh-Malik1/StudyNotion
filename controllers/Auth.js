const User = require('../models/User')
const OTP = require('../models/OTP')
const otpGenerator = require("otp-generator")
const Profile = require('../models/Profile')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
require("dotenv").config()
exports.sendotp = async (req,res)=>{
    try{
        const {email} = req.body
        const checkUserPresent  =  await User.findOne({email})
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
    catch(err){
        console.log("Error in OTP generating")
        console.log(err)
        process.exit(1)
    }

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
        console.log("OTP IN DB",recentOtp.otp)
        if(recentOtp.length==0){
            return res.status(402).json({
                success:false,
                message:"OTP not found"
            })
        }
    
        else if(otp!=recentOtp[0].otp){
            return res.status(402).json({
                success:false,
                message:"Invalid OTP"
            })
        }
    
        const hashedPass = await bcrypt.hash(password,10)
        let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);
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
			password: hashedPass,
			accountType: accountType,
			approved: approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
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
        const userExist = await User.findOne({email:email})
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
                expiresIn:'4h'
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


exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};