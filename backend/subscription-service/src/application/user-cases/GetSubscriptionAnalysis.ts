import { inject, injectable } from "inversify";
import { IGetSubscriptionAnalysis } from "../../domain/use-cases/ISubscriptionUseCase";
import { TYPES } from "../../types";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";

@injectable()
export class GetSubscriptionAnalysis implements IGetSubscriptionAnalysis {

    constructor(
        @inject(TYPES.ISubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository
    ){}

    async getSubscriptionAnalysis(): Promise<any> {
        const result=await this._subscriptionRepository.getSubscriptionAnalysis()
        return result
    }

}