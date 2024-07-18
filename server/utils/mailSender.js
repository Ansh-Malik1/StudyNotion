const nodemailer  =  require('nodemailer')

const mailSender = async(email,title,body)=>{
    try{
        // have to read about it more
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            service:"gmail",
            secure:true,
            logger:true,
            debug:true,
            secureConnection:false,
            port:587,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            },
            tls:{
                rejectUnauthorized:true
            }
        })
        let info = await transporter.sendMail({
            from:'StudyNotion || Ansh Malik',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(info)
        return info
    }
    catch(error){
        console.log("Error in mailsender.js")
        console.log(error)
    }
}

module.exports = mailSender