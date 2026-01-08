import { inject, injectable } from "inversify";
import { IEditSubscription, SubscriptionData } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import { TYPES } from "../../types";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";

@injectable()
export class EditSubscription implements IEditSubscription {

    constructor(
        @inject(TYPES.ISubscriptionTypesRepository) private _subscriptionTypesRepository: ISubscriptionTypesRepository
    ) { }

    async editSubscription(data: SubscriptionData): Promise<{ success: boolean; }> {
        const result = await this._subscriptionTypesRepository.editPlan(data);
        return result;
    }

}