import { inject, injectable } from "inversify";
import { IBuySubscription } from "../../domain/use-cases/ISubscriptionUseCase";
import { TYPES } from "../../types";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";

@injectable()
export class BuySubscription implements IBuySubscription {

    constructor(
        @inject(TYPES.ISubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository
    ){}

    async buySubscription(id: string, user: string, validity:number): Promise<{ success: boolean; }> {
        let num=validity
        if(typeof validity=='string') num=parseInt(validity)
        const result=await this._subscriptionRepository.addSubscription(id, user, num)
        return result
    }

}