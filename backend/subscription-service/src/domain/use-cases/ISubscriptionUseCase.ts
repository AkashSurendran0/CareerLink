export interface IBuySubscription {
    buySubscription(id:string, user:string, validity:number, email:string): Promise<{success:boolean}>
}

import { Subscription } from "../entity/Subscription";
import { SubscriptionType } from "../entity/SubscriptionType";

export interface IGetUserSubscription {
    getSubscription(user:string): Promise<{ plan: Subscription | null; planDetails?: SubscriptionType | null }>
}

export interface IDeletePlan {
    deletePlan(user:string): Promise<{success: boolean}>
}

export interface IGetSubscriptionInfo {
    getInfo(user:string): Promise<{success:boolean}>
}

export interface IGetActivePlanUsers {
    getActiveUsers(plan:string): Promise<{success:boolean}>
}

export interface IGetSubscriptionAnalysis {
    getSubscriptionAnalysis(): Promise<Array<{ month: string; count: number }>>
}

export interface IGetPremiumUserCount {
    getPremiumUserCount(): Promise<number>
}