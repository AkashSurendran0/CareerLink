import nodemailer,{Transporter} from "nodemailer";
import { injectable } from "inversify";

@injectable()
export class Mailer {
    private _transporter:Transporter;

    constructor(){
        this._transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"achusnjr11@gmail.com",
                pass:"vbwy yumg cwko hksa"
            }
        });
    }

    async sendMail(to:string, subject:string, text:string){
        const mailOptions={
            from: "CareerLink@gmail.com",
            to,
            subject,
            text
        };

        const info=await this._transporter.sendMail(mailOptions);
        console.log("Mail send");
        return info;
    }
}