export interface SubscriptionTypeDto {
    _id: string,
    name: string,
    amount: number,
    billingCycle: number,
    features: {
        text: string,
        code: string
    }[],
    active: boolean
}