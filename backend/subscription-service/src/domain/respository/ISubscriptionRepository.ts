import { Subscription } from "../entity/Subscription"

export interface ISubscriptionRepository {
    addSubscription(id:string, user:string, validity:number):Promise<{success:boolean}>
    getByUser(user:string): Promise<Subscription | null>
    deletePlan(user:string): Promise<{success:boolean}>
    getInfo(user:string): Promise<{success:boolean}>
    getActivePlanUsers(plan:string): Promise<{success:boolean}>
    deletePlans(id:string): Promise<{success:boolean}>
    getSubscriptionAnalysis(): Promise<any>
    groupByPlan(): Promise<any>
    getPremiumUserCount(): Promise<number>
}