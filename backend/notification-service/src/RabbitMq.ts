import { connect, Connection, Channel, ConsumeMessage } from "amqplib";
import { Mailer } from "./utils/MailHelper";
import { IAddNotification } from "./domain/services/INotificationServices";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import dotenv from "dotenv";
import { logger } from "./utils/logger";

dotenv.config();

@injectable()
export class RabbitMqService {
    // Use any temporarily to bypass broken amqplib types
    private connection: any = null;
    private channel: any = null;
    private readonly exchange = ["company.events", "subscription.events", "connection.events", "jobApplication.events", "mail.events"];

    constructor(
        @inject(TYPES.Mailer) private _mailer: Mailer,
        @inject(TYPES.IAddNotification) private _addNotification: IAddNotification
    ) { }

    public async connect(): Promise<void> {
        try {
            this.connection = await connect(process.env.RABBITMQ_URL as string);
            this.channel = await this.connection!.createChannel();

            for (const exchange of this.exchange) {
                await this.channel!.assertExchange(exchange, "topic", { durable: true });
            }

            logger.info("RabbitMq connected and exchanges asserted");
        } catch (error: unknown) {
            logger.error({ error }, "RabbitMq connection failed");
            throw error;
        }
    }

    public async consumeNotification(): Promise<void> {
        if (!this.channel) throw new Error("RabbitMq channel not initialized");

        const queue = await this.channel.assertQueue("notification-queue", { durable: true });

        await this.channel.bindQueue(queue.queue, "company.events", "company.approved");
        await this.channel.bindQueue(queue.queue, "company.events", "company.rejected");
        await this.channel.bindQueue(queue.queue, "company.events", "company.blocked");
        await this.channel.bindQueue(queue.queue, "company.events", "company.unblocked");
        await this.channel.bindQueue(queue.queue, "subscription.events", "subscription.upgraded");
        await this.channel.bindQueue(queue.queue, "connection.events", "connection.sendRequest");
        await this.channel.bindQueue(queue.queue, "connection.events", "connection.acceptRequest");
        await this.channel.bindQueue(queue.queue, "jobApplication.events", "jobApplication.accepted");
        await this.channel.bindQueue(queue.queue, "jobApplication.events", "jobApplication.rejected");
        await this.channel.bindQueue(queue.queue, "jobApplication.events", "jobApplication.applicationHired");
        await this.channel.bindQueue(queue.queue, "mail.events", "mail.sendWarningMail");

        logger.info("Notification service is listening for messages...");

        this.channel.consume(queue.queue, async (msg: ConsumeMessage | null) => await this.handleMessages(msg), { noAck: false });
    }

    private async handleMessages(msg: ConsumeMessage | null): Promise<void> {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString());

        try {
            switch (data.action) {
                case "approved":
                    await this._addNotification.saveNotification(data.registeredBy, "Your Company has been approved 🎉", "/company/registeredCompany");
                    await this._mailer.sendMail(data.registeredBy, "Your company has been approved on CareerLink! 🎉",
                        `Hello ${data.companyName} team,

We’re excited to let you know that your company registration on CareerLink has been approved!

You can now log in to your account and start exploring our platform — post job openings, connect with candidates, and manage your hiring process seamlessly.

Welcome aboard!

Best regards,  
The CareerLink Team
`
                    );
                    break;

                case "rejected":
                    await this._addNotification.saveNotification(data.registeredBy, "Update on your company registration", "/company/registeredCompany");
                    await this._mailer.sendMail(data.registeredBy, "Update on your CareerLink company registration ",
                        `Hello ${data.companyName} team,
Thank you for registering your company with CareerLink.  
After reviewing your application, we regret to inform you that it was not approved at this time.

This could be due to missing or unverifiable information.  
You can review your submission and reapply with updated details.

If you believe this decision was made in error, please contact our support team.

Best regards,  
The CareerLink Team
`
                    );
                    break;

                case "blocked":
                    await this._addNotification.saveNotification(data.registeredBy, "Company Account Temporarily Blocked", "/company/registeredCompany");
                    await this._mailer.sendMail(data.registeredBy, "Company Account Temporarily Blocked",
                        `Hello ${data.companyName} Team,

We wanted to inform you that your company account has been temporarily blocked by the admin due to policy or activity-related concerns.

During this period:
- You will not be able to access your company dashboard or perform account-related operations.
- Any active sessions will be automatically logged out.

If you believe this action was taken in error, please reach out to our support team for review.

Thank you for your understanding and cooperation.

Best regards,  
The CareerLink Team
`
                    );
                    break;

                case "unblocked":
                    await this._addNotification.saveNotification(data.registeredBy, "Company Account Reinstated Successfully", "/company/registeredCompany");
                    await this._mailer.sendMail(data.registeredBy, "Company Account Reinstated Successfully",
                        `Hello ${data.companyName} Team,

Good news! Your company account has been successfully unblocked by the admin.

You can now log back into your dashboard and continue using all available features.

We appreciate your patience and understanding throughout the process.  
If you face any issues logging in or using your account, please contact our support team.

Best regards,   
The CareerLink Team
`
                    );
                    break;

                case "upgraded":
                    await this._addNotification.saveNotification(data.user, "Upgraded to Vip Member 👑", "/settings");
                    break;

                case "sendRequest":
                    await this._addNotification.saveNotification(data.reciever, `${data.sender} send you a connection request`, "/meetPeople/requests");
                    break;

                case "acceptRequest":
                    await this._addNotification.saveNotification(data.reciever, `${data.sender} accepted your connection request`, "/meetPeople/myConnections");
                    break;

                case "applicationAccepted":
                    await this._addNotification.saveNotification(data.userEmail, "You have been shortlisted !!", "/profile/user/jobsApplied");
                    break;

                case "applicationRejected":
                    await this._addNotification.saveNotification(data.userEmail, "Update on your job application", "/profile/user/jobsApplied");
                    break;

                case "applicationHired":
                    await this._addNotification.saveNotification(data.userEmail, "You have been hired !!", "/profile/user/jobsApplied");
                    break;

                case "sendWarningMail":
                    await this._mailer.sendMail(data.reciever, "Warning Regarding Reported Activity on Your Account",
                        `Hello,

We are writing to inform you that we have received a report concerning content or activity associated with your account.
After an initial review, we identified behavior that may violate our platform’s community guidelines or terms of service. At this time, no immediate action has been taken against your account. However, this message serves as a formal warning.

Please take a moment to review our guidelines and ensure that all future activity complies with our policies. Repeated or serious violations may result in further actions, including temporary restrictions or permanent suspension of your account.
If you believe this warning was issued in error, you may contact our support team for clarification.

Thank you for your cooperation.

Best regards,   
The CareerLink Team
`
                    );
                    break;

                default:
                    logger.info("Unknown type event", data.action);
            }

            this.channel!.ack(msg);
        } catch (error: unknown) {
            logger.info({ error }, "Error processing message");
            this.channel?.nack(msg, false, false);
        }
    }
}
