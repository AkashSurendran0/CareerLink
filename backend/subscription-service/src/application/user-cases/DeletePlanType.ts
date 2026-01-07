import { inject, injectable } from "inversify";
import {  IDeletePlanType } from "../../domain/use-cases/ISubscriptionTypesUseCases";
import { TYPES } from "../../types";
import { ISubscriptionTypesRepository } from "../../domain/respository/ISubscriptionTypesRepository";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";

@injectable()
export class DeletePlanType implements IDeletePlanType {
    
    constructor(
        @inject(TYPES.ISubscriptionTypesRepository) private _subscriptionTypesRepository:ISubscriptionTypesRepository,
        @inject(TYPES.ISubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository
    ){}

    async deletePlanType(id: string): Promise<{ success: boolean; }> {
        const result=await this._subscriptionRepository.getActivePlanUsers(id);
        if(!result.success) return result;
        await this._subscriptionTypesRepository.deleteType(id);
        await this._subscriptionRepository.deletePlans(id);
        return result;
    }

}