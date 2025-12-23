export interface IBuySubscription {
    buySubscription(id:string, user:string, validity:number, email:string): Promise<{success:boolean}>
}

export interface IGetUserSubscription {
    getSubscription(user:string): Promise<any> 
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
    getSubscriptionAnalysis(): Promise<any>
}