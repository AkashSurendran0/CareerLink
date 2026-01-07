import { inject, injectable } from "inversify";
import { IAlterPlanStatus } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import { TYPES } from "../../types";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";

@injectable()
export class AlterPlanStatus implements IAlterPlanStatus {

    constructor(
        @inject(TYPES.ISubscriptionTypesRepository) private _subscriptionTypeRepository:ISubscriptionTypesRepository
    ) {}

    async alterPlanStatus(id: string): Promise<{ success: boolean; }> {
        const result=await this._subscriptionTypeRepository.alterPlanStatus(id);
        return result;
    }

}