import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/StatusCodes";
import { TYPES } from "../types";
import { IAddComment, IAlterPostLike, IDeletePost, IGetAllPosts, IGetAllUserPosts, IGetSinglePostDetails, IPostContent } from "../domain/use-cases/IPostUseCase";
import { uploadPost } from "../config/upload";
import axios from "axios";
import dotenv from "dotenv";
import { logger } from "../utils/logger";

@injectable()
export class PostController {

    constructor(
        @inject(TYPES.IPostContent) private _postContent:IPostContent,
        @inject(TYPES.IGetAllPosts) private _getAllPosts:IGetAllPosts,
        @inject(TYPES.IAlterPostLike) private _alterPostLike:IAlterPostLike,
        @inject(TYPES.IAddComment) private _addComment:IAddComment,
        @inject(TYPES.IGetSinglePostDetails) private _getSinglePostDetails:IGetSinglePostDetails,
        @inject(TYPES.IGetAllUserPosts) private _getAllUserPosts:IGetAllUserPosts,
        @inject(TYPES.IDeletePost) private _deletePost:IDeletePost
    ){}

    postContent = async (req:Request, res:Response): Promise<void> => {
        try {
            const user=req.headers['user-id'] as string
            const {content}=req.body
            let text=content?? null
            let url=null
            if(req.file){
                const buffer=req.file?.buffer
                const fileType=req.file.mimetype.split("/")[1]
                url=await uploadPost(buffer, fileType)
            }  
            const result=await this._postContent.postContent(url, text, user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getAllPosts = async (req:Request, res:Response) => {
        try {
            const {lim, shown}=req.query
            const LIMIT=parseInt(lim)
            const SHOWN=parseInt(shown)
            let result=await this._getAllPosts.getAllPosts(LIMIT, SHOWN)
            for(let i=0;i<result.allPost.length;i++){
                const user=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${result.allPost[i].createdBy}`)
                result.allPost[i].userName=user.data.result.result.username
                result.allPost[i].pfp=user.data.result.pfp?? null
            }
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    alterPostLike = async (req:Request, res:Response) => {
        try {
            const {post}=req.query
            const user=req.headers['user-id'] as string
            const result=await this._alterPostLike.alterPostLike(post, user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    addComment = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-id'] as string
            const data=req.body
            const result=await this._addComment.addComment(data, user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getSinglePostDetails = async (req:Request, res:Response) => {
        try {
            const {post}=req.query
            let result=await this._getSinglePostDetails.getDetails(post)
            for(let i=0;i<result.comments.length;i++){
                const user=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${result.comments[i].by}`)
                result.comments[i].userName=user.data.result.result.username
                result.comments[i].pfp=user.data.result.pfp?? null
            }
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getAllUserPosts = async (req:Request, res:Response) => {
        try {
            const {user}=req.query
            const userId=req.headers['user-id'] as string
            const id=user || userId
            const result=await this._getAllUserPosts.getAllPosts(id)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    deletePost = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            await this._deletePost.deletePost(id)
            res.json({success:true})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }
 
}