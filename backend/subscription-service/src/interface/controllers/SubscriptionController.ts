import { Request, Response } from "express"
import { STATUS_CODES } from "../../utils/StatusCodes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IAddSubscription, IAlterPlanStatus, IDeletePlanType, IEditSubscription, IGetActivePlans, IGetAllPlans, IGetPlanDetails, IGetSubscriptionTypeAnalytics } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { stripe } from "../../config/stripe";
import { IBuySubscription, IDeletePlan, IGetActivePlanUsers, IGetPremiumUserCount, IGetSubscriptionAnalysis, IGetSubscriptionInfo, IGetUserSubscription } from "../../domain/use-cases/ISubscriptionUseCase";
import axios from "axios";

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
        @inject(TYPES.IBuySubscription) private _buySubscription:IBuySubscription,
        @inject(TYPES.IGetUserSubscription) private _getUserSubscription:IGetUserSubscription,
        @inject(TYPES.IDeletePlan) private _deletePlan:IDeletePlan,
        @inject(TYPES.IGetSubscriptionInfo) private _getSubscriptionInfo:IGetSubscriptionInfo,
        @inject(TYPES.IGetActivePlanUsers) private _getActivePlanUsers:IGetActivePlanUsers,
        @inject(TYPES.IDeletePlanType) private _deletePlanType:IDeletePlanType,
        @inject(TYPES.IGetSubscriptionAnalysis) private _getSubscriptionAnalysis:IGetSubscriptionAnalysis,
        @inject(TYPES.IGetSubscriptionTypeAnalytics) private _getSubscriptionTypeAnalytics:IGetSubscriptionTypeAnalytics,
        @inject(TYPES.IGetPremiumUserCount) private _premiumUserCount:IGetPremiumUserCount,
        @inject(TYPES.IGetPlanDetails) private _getPlanDetails:IGetPlanDetails,
        @inject(TYPES.IEditSubscription) private _editSubscription:IEditSubscription
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
            const email=req.headers['user-email'] as string
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
                    validity,
                    email
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
                this._buySubscription.buySubscription(session?.metadata?.id, session?.metadata?.user, session?.metadata?.validity, session?.metadata?.email)
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
            const email=req.headers['user-email'] as string
            const {id, time}=req.query
            const validity=parseInt(time)
            const user=req.headers['user-id'] as string
            const result=await this._buySubscription.buySubscription(id, user, validity, email)
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

    getUserPlan = async (req:Request, res:Response) => {
        try {
            let id=req.headers['user-id'] as string
            let {user}=req.query
            let userId=user || id
            // const user=req.headers['user-id'] as string
            const result=await this._getUserSubscription.getSubscription(userId)
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

    deletePlan = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-id'] as string
            await axios.delete(`http://localhost:5000/resume/v1/deletePlan?user=${user}`)
            const result=await this._deletePlan.deletePlan(user)
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

    getSubscriptionInfo = async (req:Request, res:Response) => {
        try {
            let id=req.headers['user-id'] as string
            let {user}=req.query
            let userId=user || id
            const result=await this._getSubscriptionInfo.getInfo(userId)
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

    adminUpgradeUser = async (req:Request, res:Response) => {
        try {
            const data=req.body
            const result=await this._buySubscription.buySubscription(data?.selectedPlan?._id, data?.selectedUser, data?.selectedPlan?.billingCycle, data?.selectedEmail)
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

    adminDowngradeUser = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            await axios.delete(`http://localhost:5000/resume/v1/deletePlan?user=${id}`)
            const result=await this._deletePlan.deletePlan(id)
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

    getActivePlanUsers = async (req:Request, res:Response) => {
        try {
            const {plan}=req.query
            console.log(plan)
            const result=await this._getActivePlanUsers.getActiveUsers(plan)
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

    deleteSubscriptionPlan = async (req:Request, res:Response) => {
        try {
            const {plan}=req.query
            const result=await this._deletePlanType.deletePlanType(plan)
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

    getSubscriptionAnalytics = async (req:Request, res:Response) => {
        try {
            const result=await this._getSubscriptionAnalysis.getSubscriptionAnalysis()
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

    getSubscriptionTypeAnalytics = async (req:Request, res:Response) => {
        try {
            const result=await this._getSubscriptionTypeAnalytics.getSubscriptionTypeAnalytics()
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

    getPremiumUserCount = async (req:Request, res:Response) => {
        try {
            const result=await this._premiumUserCount.getPremiumUserCount()
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

    getPlanDetails = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const result=await this._getPlanDetails.getPlanDetails(id)
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

    editSubscriptionPlan = async (req:Request, res:Response) => {
        try {
            const data=req.body
            const result=await this._editSubscription.editSubscription(data)
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