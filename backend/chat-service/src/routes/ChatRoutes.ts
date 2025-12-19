import { Router } from "express";
import container from "../inversify.config";
import { ChatController } from "../controller/ChatController";
import { TYPES } from "../types";

const router=Router()
const chatController=container.get<ChatController>(TYPES.ChatController)

router.post('/startUserConversation', chatController.startUserConversation)
router.get('/getConversations', chatController.getConversations)
router.patch('/sendMessage', chatController.sendMessage)
router.get('/getChats', chatController.getChats)
router.patch('/readMessages', chatController.readMessages)
router.get('/getCompanyConversations', chatController.getCompanyConversations)
router.get('/getReportedMessage', chatController.getReportedMessage)

export default router