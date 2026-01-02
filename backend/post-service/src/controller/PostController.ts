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
                if (!buffer) {
                    res.status(STATUS_CODES.BAD_REQUEST).json({ message: "File buffer is required" });
                    return;
                }
                const fileType=req.file.mimetype.split("/")[1]
                if (!fileType) {
                    res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Invalid file type" });
                    return;
                }
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
            if (typeof lim !== 'string' || typeof shown !== 'string') {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "lim and shown parameters are required" });
            }
            const LIMIT=parseInt(lim)
            const SHOWN=parseInt(shown)
            let result=await this._getAllPosts.getAllPosts(LIMIT, SHOWN)
            for(let i=0;i<result.allPost.length;i++){
                const post = result.allPost[i];
                if (!post) continue;
                const userResponse=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${post.createdBy}`)
                const username = userResponse.data?.result?.result?.username;
                const pfp = userResponse.data?.result?.pfp ?? null;
                // Controller boundary: using any to add dynamic properties to DTO
                (post as any).userName = username;
                (post as any).pfp = pfp;
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
            if (typeof post !== 'string') {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "post parameter is required" });
            }
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
            if (typeof post !== 'string') {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "post parameter is required" });
            }
            let result=await this._getSinglePostDetails.getDetails(post)
            for(let i=0;i<result.comments.length;i++){
                const comment = result.comments[i];
                if (!comment) continue;
                const userResponse=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${comment.by}`)
                const username = userResponse.data?.result?.result?.username;
                const pfp = userResponse.data?.result?.pfp ?? null;
                // Controller boundary: using any to add dynamic properties to comment objects
                (comment as any).userName = username;
                (comment as any).pfp = pfp;
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
            let id: string;
            if (typeof user === 'string') {
                id = user;
            } else {
                id = userId;
            }
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
            if (typeof id !== 'string') {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "id parameter is required" });
            }
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