import { RabbitMqService } from "./RabbitMq";


(async ()=>{
    const rabbitMq=new RabbitMqService()
    await rabbitMq.connect()
    await rabbitMq.consumeNotification()
})()