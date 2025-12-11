import { Router } from "express";
import container from "../inversify.config";
import { ChatController } from "../controller/ChatController";
import { TYPES } from "../types";

const router=Router()
const chatController=container.get<ChatController>(TYPES.ChatController)

router.post('/startUserConversation', chatController.startUserConversation)

export default router