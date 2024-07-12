const nodemailer  =  require('node-mailer')

const mailSender = async(email,title,body)=>{
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
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