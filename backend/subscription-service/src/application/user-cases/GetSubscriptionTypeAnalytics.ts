import { inject, injectable } from "inversify";
import { IGetSubscriptionTypeAnalytics } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";
import { TYPES } from "../../types";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";

@injectable()
export class GetSubscriptionTypeAnalytics implements IGetSubscriptionTypeAnalytics {

    constructor(
        @inject(TYPES.ISubscriptionTypesRepository) private _subscriptionTypesRepository: ISubscriptionTypesRepository,
        @inject(TYPES.ISubscriptionRepository) private _subscriptionRepository: ISubscriptionRepository
    ) { }

    async getSubscriptionTypeAnalytics(): Promise<Array<{ subscriptionType: string; count: number; name?: string }>> {
        const result = await this._subscriptionRepository.groupByPlan() as Array<{ subscriptionType: string; count: number; name?: string }>;
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            if (item) {
                const details = await this._subscriptionTypesRepository.findById(item.subscriptionType);
                if (details) {
                    item.name = details.name;
                }
            }
        }
        return result;
    }

}