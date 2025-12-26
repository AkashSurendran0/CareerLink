import { UserDTO } from "@careerlink/types";

export class UserMapper {
    static toDTO(user: any): UserDTO {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            suspended: user.suspended,
            status: user.status,
            isVip: user.isVip,
            createdAt: user.createdAt,
        };
    }
}