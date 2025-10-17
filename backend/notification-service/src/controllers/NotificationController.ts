import { Request, Response } from "express"
import { AddNotification } from "../services/AddNotification";
import { injectable, inject } from "inversify";
import { TYPES } from "../TYPES";

@injectable()
export class NotificationController {

    constructor(
        @inject(TYPES.AddNotification) private _addNotification:AddNotification
    ){}

    saveNotification = async (req:Request, res:Response) => {
        try {
            // await 
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

}