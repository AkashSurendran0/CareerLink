import { inject, injectable } from "inversify";
import{ IGetActivePlanUsers } from "../../domain/use-cases/ISubscriptionUseCase";
import { TYPES } from "../../types";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";

@injectable()
export class GetActivePlanUsers implements IGetActivePlanUsers {

    constructor(
        @inject(TYPES.ISubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository
    ){}

    async getActiveUsers(plan: string): Promise<{ success: boolean; }> {
        const result=await this._subscriptionRepository.getActivePlanUsers(plan);
        return result;
    }

}