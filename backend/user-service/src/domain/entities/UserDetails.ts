export class UserDetailsEntity {
    constructor(
        public id: string,
        public user: string,
        public profilePicture: string,
        public gender: string,
        public aboutMe: string,
        public location: string,
        public proficiency: string,
        public skills: string[],
        public education: Array<Record<string, unknown>>,
        public experience: Array<Record<string, unknown>>,
        public linkedinLink: string,
        public githubLink: string
    ) { }
}