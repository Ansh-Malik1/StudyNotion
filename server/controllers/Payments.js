const {instance} = require('../conifg/database')
const User = require("../models/User")
const Course = require("../models/Course")
const mailSender = require('../utils/mailSender')
const { default: mongoose } = require('mongoose')

exports.capturePayment = async(req,res)=>{
    try{
        const {course_id} = req.body
        const user_id = req.user.id
        if(!course_id){
            return res.status(400).json({
                success: false,
                message: "Course id is required"
            })
        }

        let course = await Course.findById(course_id)
        if(!course){
            return res.status(400).json({
                success: false,
                message: "Course not found"
            })
        }

        const uid = mongoose.Types.ObjectId(user_id)
        if(course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success: false,
                message: "You have already enrolled in this course"
            })
        }

        const amount = course.price
        const currency  = "INR"
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId:course_id,
                userId:user_id
            }
        }

        try{
            const paymentResponse = await instance.order.create(options)
            console.log(paymentResponse)
            return res.status(200).json({
                success: true,
                message: "Payment initiated successfully",
                courseName : course.courseName,
                courseDescription : course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount
            })
        }
        catch(err){
            console.log(err)
            return res.status(404).json({
                message:"Order creation failed failed",
                success:false
            })
        }

    }
    catch(err){
        console.log(err)
        return res.status(404).json({
            message:"Payment capture failed",
            success:false
        })
    }
}


exports.verifySignature= async (req,res)=>{
    try{
        const signatue = req.headers['x-razorpay-signature']
        const webhookSecret = '1234567890'

        const shasum = crypto.createHmac("shark256",webhookSecret)
        shasum.update(JSON.stringify(req.body))
        const digest = shasum.digest('hex')

        if(signatue===digest){
            console.log("Payment authorised")
            const {courseId,userId} = req.body.payload.payment.entity.notes

            try{
                const coursePurchased = await Course.findOneAndUpdate({_id:courseId}<{
                    $push:{studentsEnrolled:userId}
                },{new:true})

                if(!coursePurchased){
                    return res.status(400).json({
                        success:false,
                        message:"Course not found"
                    })
                }
                console.log(coursePurchased)

                const student = User.findOneAndUpdate({_id:userId},{
                    $push:{courses:courseId}
                },{new:true})
                

                const title = "Thank you for purchasing the course"
                const body = "You have been successfully enrolled in the course."
                const emailResponse = await mailSender(student.email,title,body)

                console.log(emailResponse)
                return res.status(200).json({
                    success:true,
                    message:"Student enrolled successfully"
                })
            }
            catch(err){
                console.log(err)
                return res.status(404).json({
                    message:"Couldn't update DB",
                    success:false
                })
            }
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Payment not authorised"
            })
        }

    }
    catch(err){
        console.log(err)
        return res.status(404).json({
            message:"Signatures doesnt match",
            success:false
        })
    }
}