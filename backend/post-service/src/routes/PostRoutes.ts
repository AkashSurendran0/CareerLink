import { Router } from "express";
import container from "../inversify.config";
import { TYPES } from "../types";
import { PostController } from "../controller/PostController";
import multer from 'multer'

const postController=container.get<PostController>(TYPES.PostController)
const upload=multer()

const router=Router()

router.post('/postContent', upload.single('image'), postController.postContent)
  
export default router 