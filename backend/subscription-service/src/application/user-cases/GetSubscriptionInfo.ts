import { inject, injectable } from "inversify";
import { IGetSubscriptionInfo } from "../../domain/use-cases/ISubscriptionUseCase";
import { TYPES } from "../../types";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";

@injectable()
export class GetSubscriptionInfo implements IGetSubscriptionInfo {

    constructor(
        @inject(TYPES.ISubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository
    ){}

    async getInfo(user: string): Promise<{ success: boolean; }> {
        const result=await this._subscriptionRepository.getInfo(user)
        return result
    }

}