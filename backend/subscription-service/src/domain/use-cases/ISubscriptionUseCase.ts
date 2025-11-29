export interface IBuySubscription {
    buySubscription(id:string, user:string, validity:number): Promise<{success:boolean}>
}