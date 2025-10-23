import { Container } from "inversify";
import { NotificationController } from "./controllers/NotificationController";
import { AddNotification } from "./services/AddNotification";
import { TYPES } from "./types";
import { Mailer } from "./utils/MailHelper";
import { RabbitMqService } from "./RabbitMq";
import { NotificationRepository } from "./infrastructure/repository/NotificationRepository";
import { GetAllNotifications } from "./services/GetAllNotifications";
import { MarkAllRead } from "./services/MarkAllRead";
import { DeleteAllNotifications } from "./services/DeleteAllNotifications";
import { DeleteOne } from "./services/DeleteOne";
import { MarkOneRead } from "./services/MarkOneRead";

const container=new Container()

container.bind(TYPES.INotificationRepository).to(NotificationRepository).inSingletonScope()
container.bind(TYPES.RabbitMqService).to(RabbitMqService).inSingletonScope()

container.bind(TYPES.Mailer).to(Mailer).inSingletonScope()
container.bind(TYPES.IAddNotification).to(AddNotification).inSingletonScope()
container.bind(TYPES.IGetAllNotifications).to(GetAllNotifications).inSingletonScope()
container.bind(TYPES.IMarkAllRead).to(MarkAllRead).inSingletonScope()
container.bind(TYPES.IDeleteAllNotifications).to(DeleteAllNotifications).inSingletonScope()
container.bind(TYPES.IDeleteOne).to(DeleteOne).inSingletonScope()
container.bind(TYPES.IMarkOneRead).to(MarkOneRead).inSingletonScope()

container.bind(TYPES.NotificationController).to(NotificationController).inSingletonScope()

export default container