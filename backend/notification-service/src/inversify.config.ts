import { Container } from "inversify";
import { NotificationController } from "./controllers/NotificationController";
import { AddNotification } from "./services/AddNotification";
import { TYPES } from "./TYPES";
import { Mailer } from "./utils/MailHelper";
import { RabbitMqService } from "./RabbitMq";
import { NotificationRepository } from "./repository/NotificationRepository";

const container=new Container()

container.bind(TYPES.NotificationRepository).to(NotificationRepository).inSingletonScope()
container.bind(TYPES.RabbitMqService).to(RabbitMqService).inSingletonScope()

container.bind(TYPES.Mailer).to(Mailer).inSingletonScope()
container.bind(TYPES.AddNotification).to(AddNotification).inSingletonScope()

container.bind(TYPES.NotificationController).to(NotificationController).inSingletonScope()

export default container