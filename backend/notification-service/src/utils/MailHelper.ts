import nodemailer,{Transporter} from "nodemailer";
import {inject, injectable} from "inversify";
import { logger } from "./logger";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || "";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "akashsurendran.personal@gmail.com";

@injectable()
export class Mailer {
    private _transporter?: Transporter;
    private _oAuth2Client: any;
    private _initializing: Promise<void> | null = null;

    constructor(){

        const oAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        // store client for later async initialization
        this._oAuth2Client = oAuth2Client;
        // start async initialization but don"t block constructor (keeps DI happy)
        this._initializing = this.initializeTransporter();
    }

    private async initializeTransporter() {
        try {
            const tokenResponse = await this._oAuth2Client.getAccessToken();
            const accessToken = tokenResponse?.token || "";

            this._transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: SENDER_EMAIL,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken,
                },
                logger: true,
                debug: true,
            });
        } catch (err) {
            logger.error({err}, "Failed to initialize mail transporter");
            this._transporter = undefined as unknown as Transporter;
        }
    }

    async sendMail(to:string, subject:string, text:string){
        const mailOptions={
            from: SENDER_EMAIL,
            to,
            subject,
            text
        };

        if (this._initializing) await this._initializing;

        if (!this._transporter) {
            throw new Error("Mail transporter not initialized");
        }

        const info = await this._transporter.sendMail(mailOptions);
        logger.info("Mail sent");
        return info;
    }
}