import { Router } from "express";
import container from "../inversify.config";
import { NotificationController } from "../controllers/NotificationController";
import { TYPES } from "../TYPES";

const notificationController=container.get<NotificationController>(TYPES.NotificationController)

const router=Router()

router.get('/getNotifications', notificationController.getAllNotifications)
router.patch('/markAllRead', notificationController.markAllRead)

export default router