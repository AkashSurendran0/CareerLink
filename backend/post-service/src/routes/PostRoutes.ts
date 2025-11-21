import { Router } from "express";
import container from "../inversify.config";
import { TYPES } from "../types";
import { PostController } from "../controller/PostController";
import multer from 'multer'

const postController=container.get<PostController>(TYPES.PostController)
const upload=multer()

const router=Router()

router.post('/postContent', upload.single('image'), postController.postContent)
router.get('/getAllPosts', postController.getAllPosts)
router.patch('/alterPostLike', postController.alterPostLike)
router.patch('/addComment', postController.addComment)
router.get('/getSinglePostDetails', postController.getSinglePostDetails)
router.get('/getAllUserPosts', postController.getAllUserPosts)
router.delete('/deletePost', postController.deletePost)
  
export default router 