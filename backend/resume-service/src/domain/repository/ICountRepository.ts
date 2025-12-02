import { Count } from "../entity/Count";

export interface ICountRepository {
    updateCount(user:string, field:string): Promise<{success:boolean} | {success:boolean, message:string}>
    deleteCount(user:string): Promise<{success:boolean}>
}