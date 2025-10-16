import amqp, {Channel, ChannelModel, ConsumeMessage} from 'amqplib'

export class RabbitMqService {
    private connection!:ChannelModel
    private channel!:Channel
    private readonly exchange=["company.events"]

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
                    break;

                case "rejected":
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