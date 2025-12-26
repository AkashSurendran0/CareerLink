import { SubscriptionTypeDto } from "../../dto/SubscriptionTypeDto";

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

export interface IAddSubscription {
    addSubscription(data:SubscriptionData): Promise<{success:boolean}>
}

export interface IGetAllPlans {
  getAllPlans(): Promise<SubscriptionTypeDto[]>
}

export interface IAlterPlanStatus {
  alterPlanStatus(id:string) : Promise<{success:boolean}>
}

export interface IGetActivePlans {
  getActivePlans(): Promise<SubscriptionTypeDto[]>
}

export interface IDeletePlanType {
  deletePlanType(id:string): Promise<{success:boolean}>
}

export interface IGetSubscriptionTypeAnalytics {
  getSubscriptionTypeAnalytics(): Promise<any>
}

export interface IGetPlanDetails {
  getPlanDetails(id:string): Promise<SubscriptionTypeDto>
}

export interface IEditSubscription {
  editSubscription(data:SubscriptionData): Promise<{success:boolean}>
}