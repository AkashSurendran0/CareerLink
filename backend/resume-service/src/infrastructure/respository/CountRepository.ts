import { ICountRepository } from "../../domain/repository/ICountRepository";
import { CountModel } from "../models/GenerationCountModel";

export class CountRepository implements ICountRepository {
  
    async updateCount(user: string, field:string): Promise<{ success: boolean; } | {success:boolean, message:string}> {
        const count=await CountModel.findOne({user:user}).lean();
        // Database boundary: treat DB result as a record and safely access dynamic field
        const countRecord = count as Record<string, unknown> | null;
        const raw = countRecord ? countRecord[field] : undefined;
        const countValue = typeof raw === "number" ? raw : 0;
        if(!count || countValue < 5){
            await CountModel.updateOne(
                {user:user},
                {$inc:{
                    [field]:1
                }},
                {upsert:true}
            );
            return {success:true};
        }else{
            return {success:false, message:"Your limit has reached"};
        }
    }

    async deleteCount(user: string): Promise<{ success: boolean; }> {
        const count=await CountModel.findOne({user:user});
        if(count) await CountModel.deleteOne({user:user});
        return {success:true};
    }

}