import { injectable } from "inversify";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";
import { SubscriptionModel } from "../models/SubscriptionModel";
import { getNthDay } from "../../utils/GetValidityDate";
import { Subscription } from "../../domain/entity/Subscription";


@injectable()
export class SubscriptionRepository implements ISubscriptionRepository {

    async addSubscription(id: string, user: string, validity:number): Promise<{ success: boolean; }> {
        const date=getNthDay(validity)
        await SubscriptionModel.create({
            user,
            subscriptionType:id,
            validTill:date
        })
        return {success:true}
    }

    async getByUser(user: string): Promise<Subscription | null> {
        const plan=await SubscriptionModel.findOne({where:{user:user}, raw:true})
        if(!plan) return null
        return new Subscription (
            plan?.id,
            plan?.user,
            plan?.subscriptionType,
            plan?.validTill,
            plan?.createdAt
        )
    }

    async deletePlan(user: string): Promise<{ success: boolean; }> {
        await SubscriptionModel.destroy({where:{user:user}})
        return {success:true}
    }

    async getInfo(user: string): Promise<{ success: boolean; }> {
        const plan=await SubscriptionModel.findOne({where:{user:user}, raw:true})
        if(!plan) return {success:false}
        if(new Date(plan.validTill) < new Date()) return {success:false}
        return {success:true}
    }

}