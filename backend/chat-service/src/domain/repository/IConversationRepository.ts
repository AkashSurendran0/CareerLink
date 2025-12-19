import { Conversation } from "../entity/Conversation"

export interface IConversationRepository {
    addConversation(user1:string, user2:string, isCompany:boolean): Promise<{success:boolean, id:string}>
    getConversations(id:string): Promise<Conversation[]>
    findByUsers(user1:string, user2:string): Promise<{success:boolean, conversation?:Conversation}>
}