import { UserDTO } from "../dto/UserDTO";

export class UserMapper {
    static toDTO(user: { id: string; username: string; email: string; suspended?: boolean; status?: boolean; isVip?: boolean; createdAt?: Date | string }): UserDTO {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            suspended: Boolean(user.suspended),
            status: Boolean(user.status),
            isVip: Boolean(user.isVip),
            createdAt: user.createdAt as Date | undefined,
        };
    }
}