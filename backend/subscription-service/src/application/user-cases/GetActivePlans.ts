import { inject, injectable } from "inversify";
import { IGetActivePlans } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import { TYPES } from "../../types";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";
import { SubscriptionTypeDto } from "../../dto/SubscriptionTypeDto";
import { SubscriptionTypesMapper } from "../../mappers/SubscriptionTypesMapper";

@injectable()
export class GetActivePlans implements IGetActivePlans{

    constructor(
        @inject(TYPES.ISubscriptionTypesRepository) private _subscriptionTypesRepository:ISubscriptionTypesRepository
    ){}

    async getActivePlans(): Promise<SubscriptionTypeDto[]> {
        const result=await this._subscriptionTypesRepository.getActivePlans()
        return result.map(plan=>SubscriptionTypesMapper.toDTO(plan))
    }

}