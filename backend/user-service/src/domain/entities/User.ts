export class User {
    constructor(
        public id: string,
        public username: string,
        public email: string,
        public password: string,
        public googleId: string,
        public suspended: boolean,
        public createdAt?: Date,
        public pending?: boolean,
        public status?: boolean
    ) { }
}