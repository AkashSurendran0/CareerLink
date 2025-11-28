import { SubscriptionTypeDto } from "../dto/SubscriptionTypeDto";

export class SubscriptionTypesMapper {
    static toDTO (sub:any) : SubscriptionTypeDto {
        return {
            _id:sub._id,
            name:sub.name,
            amount:sub.amount,
            billingCycle:sub.billingCycle,
            features:sub.features.map((item:any)=>({
                text:item.text,
                code:item.code
            })),
            active:sub.active
        }
    }   
}