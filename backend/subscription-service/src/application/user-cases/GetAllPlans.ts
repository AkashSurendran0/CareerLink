import { inject } from "inversify";
import { IGetAllPlans } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import { TYPES } from "../../types";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";
import { SubscriptionTypeDto } from "../../dto/SubscriptionTypeDto";
import { SubscriptionTypesMapper } from "../../mappers/SubscriptionTypesMapper";

export class GetAllPlans implements IGetAllPlans {

    constructor(
        @inject(TYPES.ISubscriptionTypesRepository) private _subscriptionTypesRepository:ISubscriptionTypesRepository
    ) {}

    async getAllPlans(): Promise<SubscriptionTypeDto[]> {
        const plans=await this._subscriptionTypesRepository.getAllPlans();
        return plans.map(plan=>SubscriptionTypesMapper.toDTO(plan));
    }

}