import { Connections } from "../entities/Connection";

export interface IConnectionRepository {
    sendConnection(user:string, id:string): Promise<{success:boolean}>
    findByUser(id:string): Promise<Connections | null>
}