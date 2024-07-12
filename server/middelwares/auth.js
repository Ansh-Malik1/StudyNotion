const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user')

exports.auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','') // Can also be obtained using body or cookies
        
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token Missing'
            })
        }

        try{
            const decoded =  jwt.verify(token,process.env.JWT_SECRET)
            console.log(decoded)
            req.user = decoded
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:'Invalid Token'
            })
        }
        next()
    }
    
    catch(err){
        return res.status(401).json({
            success:false,
            message:'Authorization unsuccessful'
        })
    }
}


exports.isStudent = async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(400).json({
                success:false,
                message:'You are not a student'
            })
        }
        next()
    }
    catch(err){
        return res.status(404).json({
            success:false,
            message:'Error in isStudentAuth'
        })
    }
}

exports.isInstructor = async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(400).json({
                success:false,
                message:'You are not a instructor'
            })
        }
        next()
    }
    catch(err){
        return res.status(404).json({
            success:false,
            message:'Error in isStudentAuth'
        })
    }
}

exports.isAdmin = async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(400).json({
                success:false,
                message:'You are not an admin'
            })
        }
        next()
    }
    catch(err){
        return res.status(404).json({
            success:false,
            message:'Error in isStudentAuth'
        })
    }
}