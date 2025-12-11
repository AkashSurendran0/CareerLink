export interface IStartConversation {
    startConversation(id:string, user:string):Promise<{success:boolean}>
}