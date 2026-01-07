import { Connections } from "../../domain/entities/Connection";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";
import { ConnectionModel } from "../models/ConnectionsModel";

export class ConnectionsRepository implements IConnectionRepository {

    async sendConnection(user: string, id: string): Promise<{ success: boolean; }> {
        const connection=await ConnectionModel.findOne({user:id});
        if(connection && connection.connections.includes(user)){
            return {success:false};
        }
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

    async cancelConnectionRequest(user: string, id: string): Promise<{ success: boolean; } | { success: boolean; message: string; }> {
        const userConnections=await ConnectionModel.findOne({user:id});
        if(!userConnections) return {success:false, message:"Error occured, please refresh the page and try again"};
        if(!userConnections.pending.includes(user)) return {success:false, message:"Error occured, please refresh the page and try again"};
        await ConnectionModel.updateOne(
            {user:id},
            {$pull:{
                pending:user
            }}
        );
        return {success:true};
    }

    async getUserRequests(id: string): Promise<Record<string, unknown>[]> {
        const users = await ConnectionModel.aggregate([
            { $unwind: "$pending" },
            { $match: { pending: id } }
        ]);
        return users as Record<string, unknown>[];
    }

    async acceptConnection(user1: string, user2: string): Promise<{ success: boolean; }> {
        const user1Connections=await ConnectionModel.findOne({user:user1});
        if(user1Connections && user1Connections.pending.includes(user2)){
            await ConnectionModel.updateOne(
                {user:user1},
                {$pull:{
                    pending:user2
                }}
            );
        }
        await ConnectionModel.updateOne(
            {user:user1},
            {$push:{
                connections:user2
            }},
            {upsert:true}
        );
        const user2Connections=await ConnectionModel.findOne({user:user2});
        if(user2Connections && user2Connections.pending.includes(user1)){
            await ConnectionModel.updateOne(
                {user:user2},
                {$pull:{
                    pending:user1
                }}
            );
        }
        await ConnectionModel.updateOne(
            {user:user2},
            {$push:{
                connections:user1
            }},
            {upsert:true}
        );
        return {success:true};
    }

    async rejectConnection(user: string, id: string): Promise<{ success: boolean; }> {
        const connections=await ConnectionModel.findOne({user:user});
        if(connections && connections.pending.includes(id)){
            await ConnectionModel.updateOne(
                {user:user},
                {$pull:{
                    pending:id
                }}
            );
            return {success:true};
        }
        return {success:false};
    }

    async removeConnection(id: string, user:string): Promise<{ success: boolean; }> {
        const user1Connection=await ConnectionModel.findOne({user:id});
        if(user1Connection && !user1Connection.connections.includes(user)) return {success:false};
        await ConnectionModel.updateOne(
            {user:id},
            {$pull:{
                connections:user
            }}
        );
        const user2Connection=await ConnectionModel.findOne({user:user});
        if(user2Connection && !user2Connection.connections.includes(id)) return {success:false};
        await ConnectionModel.updateOne(
            {user:user},
            {$pull:{
                connections:id
            }}
        );
        return {success:true};
    }

}