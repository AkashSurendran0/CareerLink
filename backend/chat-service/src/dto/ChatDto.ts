export interface ChatDto {
    _id:string,
    conversation:string,
    content: Array<{
        _id: string,
        sendBy: string,
        isScheduleMessage?: boolean,
        time?: string,
        date?: string,
        message?: string,
        isRead?: boolean,
        sendAt?: Date
    }>,
    createdAt?: Date
}