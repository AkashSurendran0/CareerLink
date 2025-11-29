export interface ISubscriptionRepository {
    addSubscription(id:string, user:string, validity:number):Promise<{success:boolean}>
}