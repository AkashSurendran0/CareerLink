import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/StatusCodes";
import { TYPES } from "../types";
import { IPostContent } from "../domain/use-cases/IPostUseCase";
import { uploadPost } from "../config/upload";

@injectable()
export class PostController {

    constructor(
        @inject(TYPES.IPostContent) private _postContent:IPostContent
    ){}

    postContent = async (req:Request, res:Response): Promise<void> => {
        try {
            const user=req.headers['user-email'] as string
            const {content}=req.body
            let text=content?? null
            let url=null
            if(req.file){
                const buffer=req.file?.buffer
                const fileType=req.file.mimetype.split("/")[1]
                url=await uploadPost(buffer, fileType)
            }  
            const result=await this._postContent.postContent(url, content, user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log('error', error)
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

}