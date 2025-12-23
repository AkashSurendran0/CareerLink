import { inject, injectable } from "inversify";
import { IGetSubscriptionTypeAnalytics } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";
import { TYPES } from "../../types";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";

@injectable()
export class GetSubscriptionTypeAnalytics implements IGetSubscriptionTypeAnalytics {

    constructor(
        @inject(TYPES.ISubscriptionTypesRepository) private _subscriptionTypesRepository:ISubscriptionTypesRepository,
        @inject(TYPES.ISubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository
    ){}

    async getSubscriptionTypeAnalytics(): Promise<any> {
        const result=await this._subscriptionRepository.groupByPlan()
        for(let i=0;i<result.length;i++){
            const details=await this._subscriptionTypesRepository.findById(result[i].subscriptionType)
            result[i].name=details.name
        }
        return result
    }

}