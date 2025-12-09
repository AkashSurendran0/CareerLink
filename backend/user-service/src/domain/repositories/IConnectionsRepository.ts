import { Connections } from "../entities/Connection";

export interface IConnectionRepository {
    sendConnection(user:string, id:string): Promise<{success:boolean}>
    findByUser(id:string): Promise<Connections | null>
    cancelConnectionRequest(user:string, id:string): Promise<{success:boolean} | {success:boolean, message:string}>
    getUserRequests(id:string): Promise<any>
    acceptConnection(user1:string, user2:string): Promise<{success:boolean}>
    rejectConnection(user:string, id:string): Promise<{success:boolean}>
}