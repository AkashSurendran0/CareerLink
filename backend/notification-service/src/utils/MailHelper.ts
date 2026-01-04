import nodemailer,{Transporter} from "nodemailer";
import { injectable } from "inversify";
import { logger } from "./logger";

@injectable()
export class Mailer {
    private _transporter:Transporter;

    constructor(){
        this._transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"akashsurendran.personal@gmail.com",
                pass:"spqk wnxi hmtj zznl"
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
        logger.info("Mail send");
        return info;
    }
}