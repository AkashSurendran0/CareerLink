import amqp, {Channel, ChannelModel} from "amqplib";
import dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config();

class RabbitMqService {
    private connection: ChannelModel | null=null;
    private channel: Channel | null=null;

    constructor(
        private readonly url:string = process.env.RABBITMQ_URL as string
    ){}

    public async connect(): Promise<void> {
        try {
            if(this.connection) return;
            this.connection=await amqp.connect(this.url);
            this.channel=await this.connection.createChannel();
            logger.info("RabbitMq connected");
        } catch (error) {
            logger.error({error} ,"RabbitMq conneciton failed");
            throw error;
        } 
    }

    public async publishEvent (exchange:string, routingKey:string, message: unknown): Promise<void> {
        try {
            if(!this.channel) throw new Error("Rabbitmq channel not initialized");
            await this.channel.assertExchange(exchange, "topic", {durable:true});
            const payload = JSON.stringify(message as Record<string, unknown>);
            this.channel.publish(
                exchange,
                routingKey,
                Buffer.from(payload)
            );
            logger.info(`Published event ${routingKey}`);
        } catch (error) {
            logger.error({error}, "connection error");
        }
    }
}

export const rabbitmqService = new RabbitMqService();