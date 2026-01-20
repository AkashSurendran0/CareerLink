import { Router } from "express";
import container from "../inversify.config";
import { ChatController } from "../controller/ChatController";
import { TYPES } from "../types";
import multer from "multer";

const router=Router();
const chatController=container.get<ChatController>(TYPES.ChatController);
const upload=multer();

router.post("/startUserConversation", chatController.startUserConversation);
router.get("/getConversations", chatController.getConversations);
router.patch("/sendMessage", upload.single("image"), chatController.sendMessage);
router.get("/getChats", chatController.getChats);
router.patch("/readMessages", chatController.readMessages);
router.get("/getCompanyConversations", chatController.getCompanyConversations);
router.get("/getReportedMessage", chatController.getReportedMessage);
router.delete("/deleteConversation", chatController.deleteConversation);
router.patch("/scheduleCall", chatController.scheduleCall);
router.patch("/addAcceptedCallStatus", chatController.addAcceptedCallStatus);
router.patch("/addRejectCallStatus", chatController.addRejectCallStatus);
router.get("/getOtherUser", chatController.getOtherUser);

export default router;