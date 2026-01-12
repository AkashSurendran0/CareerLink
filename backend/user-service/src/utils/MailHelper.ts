import sgMail from "@sendgrid/mail";
import { injectable } from "inversify";
import { logger } from "./logger";
import dotenv from "dotenv";
import { initSendGrid } from "./InitSendgrid";
dotenv.config();

const SENDER_EMAIL = process.env.SENDGRID_EMAIL || "akashsurendran1001@gmail.com";

@injectable()
export class Mailer {
    private sgMail;

    constructor() {
        this.sgMail = initSendGrid();
        logger.info("SendGrid Mailer initialized successfully");
    }

    async sendMail(to: string, subject: string, text: string) {
        const msg = {
            from: SENDER_EMAIL,
            to,
            subject,
            text,
        };

        try {
            await this.sgMail.send(msg);
            logger.info("Mail sent");
            return true;
        } catch (err: unknown) {
            if (err instanceof Error) logger.error({ message: err.message }, "Failed to send mail via SendGrid");
            else logger.error({ err }, "Failed to send mail via SendGrid");
            throw err;
        }
    }
}
