import { Request, Response } from "express"
import { STATUS_CODES } from "../../utils/StatusCodes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IAddSubscription, IAlterPlanStatus, IGetActivePlans, IGetAllPlans } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import crypto from 'crypto'

dotenv.config()

const razorpay=new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY!,
    key_secret: process.env.RAZORPAY_API_SECRET!
})

@injectable()
export class SubscriptionController {

    constructor(
        @inject(TYPES.IAddSubscription) private _addSubscription:IAddSubscription,
        @inject(TYPES.IGetAllPlans) private _getAllPlans:IGetAllPlans,
        @inject(TYPES.IAlterPlanStatus) private _alterPlanStatus:IAlterPlanStatus,
        @inject(TYPES.IGetActivePlans) private _getActivePlans:IGetActivePlans
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

    getActivePlans = async (req:Request, res:Response) => {
        try {
            const result=await this._getActivePlans.getActivePlans()
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

    createOrder = async (req:Request, res:Response) => {
        try {
            const {amount}=req.body

            const options={
                amount:amount*100,
                currency:'INR',
                receipt:'receipt_' + Date.now()
            }
            const order=await razorpay.orders.create(options)

            return res.json({
                success:true,
                order
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

    verifyPayment = async (req:Request, res:Response) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            const sign = razorpay_order_id + "|" + razorpay_payment_id;

            const expectedSign = crypto
                .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
                .update(sign)
                .digest("hex");

            if (razorpay_signature === expectedSign) {
                return res.json({ success: true, message: "Payment verified" });
            } else {
                return res.status(400).json({ success: false, message: "Invalid signature" });
            }
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