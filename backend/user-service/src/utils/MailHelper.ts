import nodemailer,{Transporter} from 'nodemailer'

export class Mailer {
    private transporter:Transporter

    constructor(){
        this.transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"achusnjr11@gmail.com",
                pass:"ighj btwr mzlr tgud"
            }
        })
    }

    async sendMail(to:string, subject:string, text:string){
        const mailOptions={
            from: `CareerLink@gmail.com`,
            to,
            subject,
            text
        }

        const info=await this.transporter.sendMail(mailOptions)
        console.log('Mail send')
        return info
    }
}