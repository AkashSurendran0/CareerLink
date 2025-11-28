import { Request, Response } from "express"
import { STATUS_CODES } from "../../utils/StatusCodes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IAddSubscription, IAlterPlanStatus, IGetAllPlans } from "../../domain/use-cases/ISubscriptionTypesUseCases";

@injectable()
export class SubscriptionController {

    constructor(
        @inject(TYPES.IAddSubscription) private _addSubscription:IAddSubscription,
        @inject(TYPES.IGetAllPlans) private _getAllPlans:IGetAllPlans,
        @inject(TYPES.IAlterPlanStatus) private _alterPlanStatus:IAlterPlanStatus
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

    getAllPlans = async (req:Request, res:Response) => {
        try {
            const result=await this._getAllPlans.getAllPlans()
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

    alterPlanStatus = async (req:Request, res:Response) => {
        try {
            const {plan}=req.query
            const result=await this._alterPlanStatus.alterPlanStatus(plan)
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