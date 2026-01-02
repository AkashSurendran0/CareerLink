export interface NotificationDto {
    _id: string,
    user: string,
    content: string,
    routeTo?: string,
    isRead: boolean,
    createdAt?: Date | undefined
}