import { Router } from "express";
import container from "../inversify.config";
import { NotificationController } from "../controllers/NotificationController";
import { TYPES } from "../types";

const notificationController=container.get<NotificationController>(TYPES.NotificationController)

const router=Router()

router.get('/getNotifications', notificationController.getAllNotifications)
router.patch('/markAllRead', notificationController.markAllRead)
router.delete('/deleteAll', notificationController.deleteAll)
router.delete('/deleteOne', notificationController.deleteOne)
router.patch('/readOne', notificationController.readOne)

export default router