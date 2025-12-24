import { inject, injectable } from "inversify";
import { IGetPremiumUserCount } from "../../domain/use-cases/ISubscriptionUseCase";
import { TYPES } from "../../types";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";

@injectable()
export class GetPremiumUserCount implements IGetPremiumUserCount {

    constructor(
        @inject(TYPES.ISubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository
    ){}

    async getPremiumUserCount(): Promise<number> {
        const result=await this._subscriptionRepository.getPremiumUserCount()
        return result
    }

}