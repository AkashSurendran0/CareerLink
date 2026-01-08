import { SubscriptionTypeDto } from "../../dto/SubscriptionTypeDto";

export type Feature = {
  text: string;
  code: string;
};

export type SubscriptionData = {
  name: string;
  amount: number;
  billingCycle: number;
  features: Feature[];
  active: boolean;
}

export interface IAddSubscription {
  addSubscription(data: SubscriptionData): Promise<{ success: boolean }>
}

export interface IGetAllPlans {
  getAllPlans(): Promise<SubscriptionTypeDto[]>
}

export interface IAlterPlanStatus {
  alterPlanStatus(id: string): Promise<{ success: boolean }>
}

export interface IGetActivePlans {
  getActivePlans(): Promise<SubscriptionTypeDto[]>
}

export interface IDeletePlanType {
  deletePlanType(id: string): Promise<{ success: boolean }>
}

export interface IGetSubscriptionTypeAnalytics {
  getSubscriptionTypeAnalytics(): Promise<Array<{ subscriptionType: string; count: number; name?: string }>>
}

export interface IGetPlanDetails {
  getPlanDetails(id: string): Promise<SubscriptionTypeDto>
}

export interface IEditSubscription {
  editSubscription(data: SubscriptionData): Promise<{ success: boolean }>
}