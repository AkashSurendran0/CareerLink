import { inject, injectable } from "inversify";
import { IAddSubscription, SubscriptionData } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import { TYPES } from "../../types";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";

@injectable()
export class AddSubscription implements IAddSubscription {

    constructor(
        @inject(TYPES.ISubscriptionTypesRepository) private _subscriptionTypeRepository: ISubscriptionTypesRepository
    ) { }

    async addSubscription(data: SubscriptionData): Promise<{ success: boolean; }> {
        const result = await this._subscriptionTypeRepository.addSubscription(data);
        return result;
    }

}