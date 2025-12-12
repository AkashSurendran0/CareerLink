import { Conversation } from "../entity/Conversation"

export interface IConversationRepository {
    addConversation(user1:string, user2:string): Promise<{success:true}>
    getUserConversations(id:string): Promise<Conversation[]>
}