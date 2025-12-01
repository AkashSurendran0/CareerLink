import { SubscriptionType } from "../entity/SubscriptionType";

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

export interface ISubscriptionTypesRepository {
    addSubscription(data:SubscriptionData): Promise<{success:boolean}>
    getAllPlans(): Promise<SubscriptionType[]>
    alterPlanStatus(id:string): Promise<{success:boolean}>
    getActivePlans(): Promise<SubscriptionType[]>
    findById(id:string): Promise<SubscriptionType>
}