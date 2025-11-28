import { Router } from "express";
import container from "../inversify.config";
import { SubscriptionController } from "../interface/controllers/SubscriptionController";
import { TYPES } from "../types";

const subscriptionController=container.get<SubscriptionController>(TYPES.SubscriptionController)

const router=Router()

router.post('/addSubscription', subscriptionController.addSubscription)

export default router