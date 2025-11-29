import { Request, Response } from "express"
import { STATUS_CODES } from "../../utils/StatusCodes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IAddSubscription, IAlterPlanStatus, IGetActivePlans, IGetAllPlans } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { stripe } from "../../config/stripe";
import { IBuySubscription } from "../../domain/use-cases/ISubscriptionUseCase";

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
        @inject(TYPES.IGetActivePlans) private _getActivePlans:IGetActivePlans,
        @inject(TYPES.IBuySubscription) private _buySubscription:IBuySubscription
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

    createStripePayment = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-id'] as string
            const {amount, id, validity}=req.body
            
            const session = await stripe.checkout.sessions.create({
                payment_method_types:["card"],
                mode:'payment',
                success_url:'http://localhost:3000/settings',
                cancel_url:'http://localhost:3000/becomeVip',
                line_items:[
                    {
                        price_data:{
                            currency:'inr',
                            product_data:{
                                name:'Premium subscription'
                            },
                            unit_amount:amount*100
                        },
                        quantity:1
                    }
                ],
                metadata:{
                    user,
                    id,
                    validity
                }
            })

            res.json({success:true, id:session.id, url:session.url})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log('error', error)
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    controlWebhook = async (req:Request, res:Response) => {
        try {
            const sig=req.headers['stripe-signature']
            // console.log(sig)
            let event

            try {
                event=stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
            } catch (error:any) {
                console.error("Webhook signature verification failed:", error.message);
                return res.status(400).send(`Webhook Error: ${error.message}`);
            }

            if(event.type == 'checkout.session.completed'){
                const session=event.data.object 
                // return console.log(session)
                this._buySubscription.buySubscription(session.metadata.id, session.metadata.user, session.metadata.validity)
                console.log('Payment successfull')
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

    buyPremium = async (req:Request, res:Response) => {
        try {
            const {id, time}=req.query
            const validity=parseInt(time)
            const user=req.headers['user-id'] as string
            const result=await this._buySubscription.buySubscription(id, user, validity)
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