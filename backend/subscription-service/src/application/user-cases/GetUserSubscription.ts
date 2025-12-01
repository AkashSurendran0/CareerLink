import { inject, injectable } from "inversify";
import { IGetUserSubscription } from "../../domain/use-cases/ISubscriptionUseCase";
import { TYPES } from "../../types";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";

@injectable()
export class GetUserSubscription implements IGetUserSubscription {

    constructor(
        @inject(TYPES.ISubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository,
        @inject(TYPES.ISubscriptionTypesRepository) private _subscriptionTypesRepository:ISubscriptionTypesRepository
    ) {}

    async getSubscription(user:string): Promise<any> {
        const plan=await this._subscriptionRepository.getByUser(user)
        let planDetails=null
        if(plan) planDetails = await this._subscriptionTypesRepository.findById(plan.subscriptionType)
        return {plan, planDetails}
    }

}