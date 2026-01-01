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
        const plans=await SubscriptionTypesModel.find()
        const allPlans=plans.map(plan=>{
            const features=plan.features.map(
                f=>new Features(f.text, f.code)
            )

            return new SubscriptionType (
                plan._id,
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
        const plans=await SubscriptionTypesModel.find({active:true})   
        const allPlans=plans.map(plan=>{
            const features=plan.features.map(
                f=>new Features(f.text, f.code)
            )

            return new SubscriptionType (
                plan._id,
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
        const details=await SubscriptionTypesModel.findById(id)
        if(!details) return null
        const features=details.features.map(
            f=>new Features(f.text, f.code)
        )
        return new SubscriptionType(
            details._id,
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
        await SubscriptionTypesModel.findByIdAndUpdate(
            data._id,
            {$set:{
                name:data.name,
                amount:data.amount,
                billingCycle:data.billingCycle,
                features:data.features,
                active:data.active
            }}
        )
        return {success:true}
    }

}