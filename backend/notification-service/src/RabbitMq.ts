import amqp, {Channel, ChannelModel, ConsumeMessage} from 'amqplib'
import { Mailer } from './utils/MailHelper'

class RabbitMqService {
    private connection!:ChannelModel
    private channel!:Channel
    private readonly exchange=["company.events"]
    private mailer:Mailer

    constructor(){
        this.mailer=new Mailer()
    }

    public async connect(): Promise<void> {
        try {
            this.connection=await amqp.connect('amqp://localhost')
            this.channel=await this.connection.createChannel()

            for(const exchange of this.exchange){
                await this.channel.assertExchange(exchange, "topic", {durable:true})
            }

            console.log('RabbitMq connected and exchanges asserted')
        } catch (error) {
            console.log('RabbitMq connection failed', error)
            throw error 
        }
    }

    public async consumeNotification():Promise<void> {
        if(!this.channel) throw new Error('RabbitMq channel not initialized')

        const queue=await this.channel.assertQueue('notification-queue', {durable:true})

        await this.channel.bindQueue(queue.queue, "company.events", "company.approved")
        await this.channel.bindQueue(queue.queue, "company.events", "company.rejected")

        console.log('Notification service is listening for messages...')

        this.channel.consume(queue.queue, async (msg) => await this.handleMessages(msg), {noAck:false})
    }

    private async handleMessages(msg:ConsumeMessage | null): Promise<void> {
        if(!msg) return 

        const data=JSON.parse(msg.content.toString())
        console.log('Recieved:', data)

        try{
            switch(data.action){
                case "approved":
                    await this.mailer.sendMail(data.registeredBy, 'Your company has been approved on CareerLink! 🎉', 
                        `Hello ${data.companyName} team,

We’re excited to let you know that your company registration on CareerLink has been approved!

You can now log in to your account and start exploring our platform — post job openings, connect with candidates, and manage your hiring process seamlessly.

Welcome aboard!

Best regards,  
The CareerLink Team
`
                    )
                    break;

                case "rejected":
                    await this.mailer.sendMail(data.registeredBy, 'Update on your CareerLink company registration ', 
                        `Hello ${data.companyName} team,
Thank you for registering your company with CareerLink.  
After reviewing your application, we regret to inform you that it was not approved at this time.

This could be due to missing or unverifiable information.  
You can review your submission and reapply with updated details.

If you believe this decision was made in error, please contact our support team.

Best regards,  
The CareerLink Team
`
                    )
                    break

                default:
                    console.log('Unknown type event', data.action)
            }

            this.channel.ack(msg)
        }catch(error){
            console.log('Error processing message', error)
            this.channel.nack(msg, false, false)
        }
    } 
}

export const rabbitmqService = new RabbitMqService()