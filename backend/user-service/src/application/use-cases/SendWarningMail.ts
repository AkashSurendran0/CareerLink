import { ISendWarningMail } from "../../domain/use-cases/IUserUseCase";
import { rabbitmqService } from "../../utils/Rabbitmq";

export class SendWarningMail implements ISendWarningMail {

    async sendWarningMail(email: string): Promise<{ success: boolean; }> {
        await rabbitmqService.publishEvent("mail.events", "mail.sendWarningMail", {
            reciever:email,
            action:"sendWarningMail"
        });
        return {success:true};
    }

}