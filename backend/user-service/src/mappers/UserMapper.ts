import { UserDTO } from "../dto/UserDTO";

export class UserMapper {
    static toDTO(user:any): UserDTO {
        return {
            id:user.id, 
            username:user.username,
            email:user.email,
            suspended:user.suspended,
            createdAt:user.createdAt,
        };
    }
}