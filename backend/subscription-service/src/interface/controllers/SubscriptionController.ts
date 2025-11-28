import { Request, Response } from "express"
import { STATUS_CODES } from "../../utils/StatusCodes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IAddSubscription } from "../../domain/use-cases/ISubscriptionTypesUseCases";

@injectable()
export class SubscriptionController {

    constructor(
        @inject(TYPES.IAddSubscription) private _addSubscription:IAddSubscription
    ) {}

    addSubscription = async (req:Request, res:Response) => {
        try {
            const data=req.body
            const result=await this._addSubscription.addSubscription(data)
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