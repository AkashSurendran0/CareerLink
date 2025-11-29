import { injectable } from "inversify";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";
import { SubscriptionModel } from "../models/SubscriptionModel";
import { getNthDay } from "../../utils/GetValidityDate";


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

}