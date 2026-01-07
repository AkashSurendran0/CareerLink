import { inject, injectable } from "inversify";
import { ICheckTailoredVersion } from "../domain/services/IResumeServices";
import { TYPES } from "../types";
import { ICountRepository } from "../domain/repository/ICountRepository";

@injectable()
export class CheckTailoredVersion implements ICheckTailoredVersion {

    constructor(
        @inject(TYPES.ICountRepository) private _countRepository:ICountRepository
    ){}

    async checkTailoredResume(details: Record<string, unknown>, user:string): Promise<{ success: boolean; } | { success: boolean; message: string; }> {
        const plan = details.plan as Record<string, unknown> | undefined;
        const planDetails = details.planDetails as Record<string, unknown> | undefined;
        if(!plan) return {success:false, message:"You dont have a plan to do this action"};
        const validTill = plan.validTill as string | Date | undefined;
        if(validTill && new Date(validTill) < new Date()) return {success:false, message:"Seems like your plan has expired"};
        if(!planDetails) return {success:false, message:"Something went wrong, Please try again"};
        const features = (planDetails.features as Array<Record<string, unknown>> | undefined) ?? [];
        for(const feat of features){
            const code = feat.code as string | undefined;
            if(code === "UNL_TAIL_RES_GEN"){
                return {success:true};
            }else if(code === "5_TAIL_RES_GEN"){
                const result=await this._countRepository.updateCount(user, "tailoredResume");
                return result;
            }
        }
        return {success:false, message:"Your plan doesnt allow this function. Please upgrade your plan"};
    }

    async checkTailoredCoverLetter(details: Record<string, unknown>, user:string): Promise<{ success: boolean; } | { success: boolean; message: string; }> {
        const plan = details.plan as Record<string, unknown> | undefined;
        const planDetails = details.planDetails as Record<string, unknown> | undefined;
        if(!plan) return {success:false, message:"You dont have a plan to do this action"};
        const validTill = plan.validTill as string | Date | undefined;
        if(validTill && new Date(validTill) < new Date()) return {success:false, message:"Seems like your plan has expired"};
        if(!planDetails) return {success:false, message:"Something went wrong, Please try again"};
        const features = (planDetails.features as Array<Record<string, unknown>> | undefined) ?? [];
        for(const feat of features){
            const code = feat.code as string | undefined;
            if(code === "UNL_TAIL_COV_GEN"){
                return {success:true};
            }else if(code === "5_TAIL_COV_GEN"){
                const result=await this._countRepository.updateCount(user, "tailoredCoverLetter");
                return result;
            }
        }
        return {success:false, message:"Your plan doesnt allow this function. Please upgrade your plan"};
    }

}