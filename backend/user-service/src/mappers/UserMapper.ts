import { UserDTO } from "../dto/UserDTO";

export class UserMapper {
    static toDTO(user: any): UserDTO {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            suspended: Boolean(user.suspended),
            status: Boolean(user.status),
            isVip: Boolean(user.isVip),
            createdAt: user.createdAt instanceof Date ? user.createdAt : user.createdAt,
        };
    }
}