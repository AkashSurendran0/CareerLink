import { inject, injectable } from "inversify";
import { IGetPlanDetails } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import { TYPES } from "../../types";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";
import { SubscriptionTypeDto } from "../../dto/SubscriptionTypeDto";
import { SubscriptionTypesMapper } from "../../mappers/SubscriptionTypesMapper";

@injectable()
export class GetPlanDetails implements IGetPlanDetails {

    constructor(
        @inject(TYPES.ISubscriptionTypesRepository) private _subscriptionTypesRepository:ISubscriptionTypesRepository
    ){}

    async getPlanDetails(id: string): Promise<SubscriptionTypeDto> {
        const result=await this._subscriptionTypesRepository.findById(id);
        return SubscriptionTypesMapper.toDTO(result);
    }

}