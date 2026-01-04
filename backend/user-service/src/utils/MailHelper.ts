import nodemailer,{Transporter} from "nodemailer";
import {inject, injectable} from "inversify";
import { logger } from "./logger";

@injectable()
export class Mailer {
    private _transporter:Transporter;

    constructor(){
        this._transporter=nodemailer.createTransport({
            service: "gmail",
  auth: {
    user: "akashsurendran.personal@gmail.com",
    pass: "spqk wnxi hmtj zznl"
  },
  logger: true,
  debug: true,
        });
    }

    async sendMail(to:string, subject:string, text:string){
        console.log(to, subject, text);
        const mailOptions={
            from: "CareerLink@gmail.com",
            to,
            subject,
            text
        };
        try {
            console.log("Sending mail...", mailOptions);
            const info=await this._transporter.sendMail(mailOptions);
            logger.info("Mail send");
            return info;
        } catch (error) {
            console.log(error);
        }
    }
}