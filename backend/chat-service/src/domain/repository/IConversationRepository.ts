export interface IConversationRepository {
    addConversation(user1:string, user2:string): Promise<{success:true}>
}