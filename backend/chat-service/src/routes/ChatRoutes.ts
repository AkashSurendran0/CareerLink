import { Router } from "express";
import container from "../inversify.config";
import { ChatController } from "../controller/ChatController";
import { TYPES } from "../types";

const router=Router();
const chatController=container.get<ChatController>(TYPES.ChatController);

router.post("/startUserConversation", chatController.startUserConversation);
router.get("/getConversations", chatController.getConversations);
router.patch("/sendMessage", chatController.sendMessage);
router.get("/getChats", chatController.getChats);
router.patch("/readMessages", chatController.readMessages);
router.get("/getCompanyConversations", chatController.getCompanyConversations);
router.get("/getReportedMessage", chatController.getReportedMessage);
router.delete("/deleteConversation", chatController.deleteConversation);
router.patch("/scheduleCall", chatController.scheduleCall);
router.patch("/addAcceptedCallStatus", chatController.addAcceptedCallStatus);
router.patch("/addRejectCallStatus", chatController.addRejectCallStatus);

export default router;