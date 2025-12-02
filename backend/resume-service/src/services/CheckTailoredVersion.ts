import { inject, injectable } from "inversify";
import { ICheckTailoredVersion } from "../domain/services/IResumeServices";
import { TYPES } from "../types";
import { ICountRepository } from "../domain/repository/ICountRepository";

@injectable()
export class CheckTailoredVersion implements ICheckTailoredVersion {

    constructor(
        @inject(TYPES.ICountRepository) private _countRepository:ICountRepository
    ){}

    async checkTailoredResume(details: any, user:string): Promise<{ success: boolean; } | { success: boolean; message: string; }> {
        if(!details.plan) return {success:false, message:'You dont have a plan to do this action'}
        if(new Date(details.plan.validTill) < new Date()) return {success:false, message:'Seems like your plan has expired'}
        if(!details.planDetails) return {success:false, message:'Something went wrong, Please try again'}
        for(let feat of details.planDetails.features){
            if(feat.code == 'UNL_TAIL_RES_GEN'){
                return {success:true}
            }else if(feat.code == '5_TAIL_RES_GEN'){
                const result=await this._countRepository.updateCount(user, 'tailoredResume')
                return result
            }
        }
        return {success:false, message:'Your plan doesnt allow this function. Please upgrade your plan'}
    }

    async checkTailoredCoverLetter(details: any, user:string): Promise<{ success: boolean; } | { success: boolean; message: string; }> {
        if(!details.plan) return {success:false, message:'You dont have a plan to do this action'}
        if(new Date(details.plan.validTill) < new Date()) return {success:false, message:'Seems like your plan has expired'}
        if(!details.planDetails) return {success:false, message:'Something went wrong, Please try again'}
        for(let feat of details.planDetails.features){
            if(feat.code == 'UNL_TAIL_COV_GEN'){
                return {success:true}
            }else if(feat.code == '5_TAIL_COV_GEN'){
                const result=await this._countRepository.updateCount(user, 'tailoredCoverLetter')
                return result
            }
        }
        return {success:false, message:'Your plan doesnt allow this function. Please upgrade your plan'}
    }

}