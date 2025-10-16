import { rabbitmqService } from "./RabbitMq";


(async ()=>{
    await rabbitmqService.connect()
    await rabbitmqService.consumeNotification()
})()