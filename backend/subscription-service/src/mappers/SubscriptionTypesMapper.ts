import { SubscriptionTypeDto } from "../dto/SubscriptionTypeDto";

type SubscriptionRecord = {
    _id: string;
    name: string;
    amount: number;
    billingCycle: number;
    features: Array<{ text: string; code: string }>;
    active: boolean;
};

export class SubscriptionTypesMapper {
    static toDTO (sub: SubscriptionRecord) : SubscriptionTypeDto {
        return {
            _id: sub._id,
            name: sub.name,
            amount: sub.amount,
            billingCycle: sub.billingCycle,
            features: sub.features.map((item)=>({
                text: item.text,
                code: item.code
            })),
            active: sub.active
        };
    }   
}