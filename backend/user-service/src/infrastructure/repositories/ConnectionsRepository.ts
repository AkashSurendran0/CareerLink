import { Connections } from "../../domain/entities/Connection";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";
import { ConnectionModel } from "../models/ConnectionsModel";

export class ConnectionsRepository implements IConnectionRepository {

    async sendConnection(user: string, id: string): Promise<{ success: boolean; }> {
        await ConnectionModel.updateOne(
            {user:id},
            {$push:{
                pending:user
            }},
            {upsert:true}
        );
        return {success:true};
    }

    async findByUser(id: string): Promise<Connections | null> {
        const result=await ConnectionModel.findOne({user:id});
        if(!result) return null;
        return new Connections (
            result.id,
            result.user,
            result.connections,
            result.pending
        );
    }

}