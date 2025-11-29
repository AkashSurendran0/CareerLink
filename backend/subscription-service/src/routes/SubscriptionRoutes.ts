import { Router } from "express";
import container from "../inversify.config";
import { SubscriptionController } from "../interface/controllers/SubscriptionController";
import { TYPES } from "../types";

const subscriptionController=container.get<SubscriptionController>(TYPES.SubscriptionController)

const router=Router()

router.post('/addSubscription', subscriptionController.addSubscription)
router.get('/getAllPlans', subscriptionController.getAllPlans)
router.patch('/alterPlanStatus', subscriptionController.alterPlanStatus)
router.get('/getActivePlans', subscriptionController.getActivePlans)
router.post('/create-order', subscriptionController.createOrder)
router.post('/verifyPayment', subscriptionController.verifyPayment)
router.post('/createStripePayment', subscriptionController.createStripePayment)
router.post('/buyPremium', subscriptionController.buyPremium)

export default router