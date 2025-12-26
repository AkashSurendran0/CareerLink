export interface UserDTO {
    id: string;
    username: string;
    email: string;
    suspended: boolean;
    status?: boolean;
    isVip?: boolean;
    createdAt: Date;
}
