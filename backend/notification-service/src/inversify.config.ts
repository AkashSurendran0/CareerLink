import { Container } from "inversify";
import { NotificationController } from "./controllers/NotificationController";
import { AddNotification } from "./services/AddNotification";
import { TYPES } from "./types";
import { Mailer } from "./utils/MailHelper";
import { RabbitMqService } from "./RabbitMq";
import { NotificationRepository } from "./repository/NotificationRepository";
import { GetAllNotifications } from "./services/GetAllNotifications";
import { MarkAllRead } from "./services/MarkAllRead";

const container=new Container()

container.bind(TYPES.NotificationRepository).to(NotificationRepository).inSingletonScope()
container.bind(TYPES.RabbitMqService).to(RabbitMqService).inSingletonScope()

container.bind(TYPES.Mailer).to(Mailer).inSingletonScope()
container.bind(TYPES.AddNotification).to(AddNotification).inSingletonScope()
container.bind(TYPES.GetAllNotifications).to(GetAllNotifications).inSingletonScope()
container.bind(TYPES.MarkAllRead).to(MarkAllRead).inSingletonScope()

container.bind(TYPES.NotificationController).to(NotificationController).inSingletonScope()

export default container