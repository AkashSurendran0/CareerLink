import amqp, {Channel, ChannelModel} from 'amqplib';

export class RabbitMqService {
    private connection: ChannelModel | null=null
    private channel: Channel | null=null

    constructor(
        private readonly url:string = "amqp://localhost"
    ){}

    public async connect(): Promise<void> {
        try {
            this.connection=await amqp.connect(this.url)
            this.channel=await this.connection.createChannel()
            console.log('RabbitMq connected')
        } catch (error) {
            console.log('RabbitMq conneciton failed', error)
            throw error
        }
    }

    public async publishEvent (exchange:string, routingKey:string, message:any): Promise<void> {
        if(!this.channel) throw new Error('Rabbitmq channel not initialized')
        await this.channel.assertExchange(exchange, "topic", {durable:true})

        this.channel.publish(
            exchange, 
            routingKey,
            Buffer.from(JSON.stringify(message))
        )

        console.log(`Published event ${routingKey}`)
    }
}