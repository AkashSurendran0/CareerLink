import amqp, {Channel, ChannelModel} from "amqplib";
import dotenv from "dotenv"

dotenv.config()

class RabbitMqService {
    private connection: ChannelModel | null=null;
    private channel: Channel | null=null;

    constructor(
        private readonly url:string = `amqp://achu:akash1@${process.env.RABBITMQ_HOST}:5672`
    ){}

    public async connect(): Promise<void> {
        try {
            if(this.connection) return;
            this.connection=await amqp.connect(this.url);
            this.channel=await this.connection.createChannel();
            console.log("RabbitMq connected");
        } catch (error) {
            console.log("RabbitMq conneciton failed", error);
            throw error;
        } 
    }

    public async publishEvent (exchange:string, routingKey:string, message:any): Promise<void> {
        try {
            if(!this.channel) throw new Error("Rabbitmq channel not initialized");
            await this.channel.assertExchange(exchange, "topic", {durable:true});
            this.channel.publish(
                exchange, 
                routingKey,
                Buffer.from(JSON.stringify(message))
            )
            console.log(`Published event ${routingKey}`);
        } catch (error) {
            console.log("connection error", error);
        }
    }
}

export const rabbitmqService = new RabbitMqService();