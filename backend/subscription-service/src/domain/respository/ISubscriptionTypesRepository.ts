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
}