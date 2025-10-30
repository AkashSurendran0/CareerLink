import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../types";
import { ICreateResume } from "../domain/services/IResumeServices";
import { STATUS_CODES } from "../utils/StatusCodes";

@injectable()
export class ResumeController {

    constructor(
        @inject(TYPES.ICreateResume) private _createResume:ICreateResume
    ){}

    createResume = async (req:Request, res:Response) => {
        try {
            const data=req.body
            const {pdf, html}=await this._createResume.createResume(data)
            const base64Pdf=pdf.toString('base64')
            res.json({
                html,
                pdf:base64Pdf
            })
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