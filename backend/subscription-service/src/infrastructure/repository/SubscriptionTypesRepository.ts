import { injectable } from "inversify";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";
import { SubscriptionTypesModel } from "../models/SubscriptionTypeModel";

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
        await SubscriptionTypesModel.insertOne(data)
        return {success:true}
    }

}