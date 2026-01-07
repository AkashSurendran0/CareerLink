import { injectable } from "inversify";
import { IConversationRepository } from "../../domain/repository/IConversationRepository";
import { ConversationModel, IConversation } from "../models/ConversationModel";
import { Conversation } from "../../domain/entity/Conversation";

@injectable()
export class ConversationRepository implements IConversationRepository {

    async addConversation(user1: string, user2: string, isCompany: boolean): Promise<{ success: boolean, id: string }> {
        const existingConversation = await ConversationModel.findOne({ users: { $all: [user1, user2] } });
        if (existingConversation) return { success: true, id: existingConversation._id.toString() };
        let conversation;
        if (isCompany) {
            const created = await ConversationModel.create({ isCompany: true, users: [user1, user2] }) as IConversation;
            conversation = created;
        } else {
            const created = await ConversationModel.create({ isCompany: false, users: [user1, user2] }) as IConversation;
            conversation = created;
        }
        return { success: true, id: conversation._id.toString() };
    }

    async getConversations(id: string): Promise<Conversation[]> {
        const userConversations = await ConversationModel.aggregate([
            {
                $match: {
                    users: { $in: [id] }
                }
            },
            { $unwind: "$users" },
            {
                $match: {
                    users: { $ne: id }
                }
            }
        ]);
        return userConversations.map((convo) => (
            new Conversation(
                String(convo._id),
                Boolean(convo.isCompany),
                convo.users,
                convo.createdAt ?? new Date()
            )
        ));
    }

    async findByUsers(user1: string, user2: string): Promise<{ success: boolean; conversation?: Conversation; }> {
        const conversation = await ConversationModel.findOne({ users: { $in: [user1, user2] } });
        if (!conversation) return { success: false };
        const convo = new Conversation(
            conversation._id.toString(),
            Boolean(conversation.isCompany),
            conversation.users,
            conversation.createdAt ?? new Date()
        );
        return { success: true, conversation: convo };
    }

    async deleteConversation(id: string): Promise<{ success: boolean; }> {
        const result = await ConversationModel.deleteOne({ _id: id });
        return { success: true };
    }

}