import { inject, injectable } from "inversify";
import { IDeletePlan } from "../../domain/use-cases/ISubscriptionUseCase";
import { TYPES } from "../../types";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";

@injectable()
export class DeletePlan implements IDeletePlan {

    constructor(
        @inject(TYPES.ISubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository
    ) {}

    async deletePlan(user: string): Promise<{ success: boolean; }> {
        const result=await this._subscriptionRepository.deletePlan(user);
        return result;
    }

}