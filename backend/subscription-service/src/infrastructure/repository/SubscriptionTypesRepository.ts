import { injectable } from "inversify";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";
import { SubscriptionTypesModel } from "../models/SubscriptionTypeModel";
import { Features, SubscriptionType } from "../../domain/entity/SubscriptionType";

type Feature = {
  text: string;
  code: string;
};

type SubscriptionData = {
    planName:string,
    amount:number,
    features:Feature[]
    status:boolean
}

@injectable()
export class SubscriptionTypesRepository implements ISubscriptionTypesRepository {

    async addSubscription(data: SubscriptionData): Promise<{ success: boolean; }> {
        await SubscriptionTypesModel.insertOne(data as any)
        return {success:true}
    }

    async getAllPlans(): Promise<SubscriptionType[]> {
        const plans=await SubscriptionTypesModel.find().lean()
        const allPlans=plans.map(plan=>{
            const features=plan.features.map(
                f=>new Features(f.text, f.code)
            )

            return new SubscriptionType (
                plan._id.toString(),
                plan.name,
                plan.amount,
                plan.billingCycle,
                features,
                plan.active
            )
        })

        return allPlans
    }

    async alterPlanStatus(id: string): Promise<{ success: boolean; }> {
        const plan=await SubscriptionTypesModel.findById(id)
        if(!plan) return {success:false}
        await SubscriptionTypesModel.findByIdAndUpdate(
            id,
            {active:!plan.active}
        )
        return {success:true}
    }

    async getActivePlans(): Promise<SubscriptionType[]> {
        const plans=await SubscriptionTypesModel.find({active:true}).lean()   
        const allPlans=plans.map(plan=>{
            const features=plan.features.map(
                f=>new Features(f.text, f.code)
            )

            return new SubscriptionType (
                plan._id.toString(),
                plan.name,
                plan.amount,
                plan.billingCycle,
                features,
                plan.active
            )
        }) 

        return allPlans
    }

    async findById(id: string): Promise<SubscriptionType> {
        const details=await SubscriptionTypesModel.findById(id).lean()
        if(!details) {
            throw new Error("Subscription type not found");
        }
        const features=details.features.map(
            f=>new Features(f.text, f.code)
        )
        return new SubscriptionType(
            details._id.toString(),
            details.name,
            details.amount,
            details.billingCycle,
            features,
            details.active
        )
    }

    async deleteType(id: string): Promise<{ success: true; }> {
        await SubscriptionTypesModel.deleteOne({_id:id})
        return {success:true}
    }

    async editPlan(data: { planName: string; amount: number; features: { text: string; code: string; }[]; status: boolean; }): Promise<{ success: boolean; }> {
        // Database boundary: using any to handle runtime data structure
        const editData = data as any;
        await SubscriptionTypesModel.findByIdAndUpdate(
            editData._id,
            {$set:{
                name:editData.name,
                amount:editData.amount,
                billingCycle:editData.billingCycle,
                features:editData.features,
                active:editData.active
            }}
        )
        return {success:true}
    }

}