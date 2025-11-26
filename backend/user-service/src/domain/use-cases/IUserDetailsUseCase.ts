type details={
    gender:string,
    location:string,
    proficiency:string,
    aboutMe:string,
    experience:string,
    skills:string,
    education:string,
    linkedinLink:string,
    githubLink:string
}

type Education = {
    degree: string;
    university: string;
    passingYear: string;
};

type Experience = {
    company: string;
    experience: string;
};

type Details = {
    username: string;
    profilePicture?: string;
    gender:string;
    aboutMe: string;
    location: string,
    proficiency: string,
    skills: string[];
    education: Education[];
    experience: Experience[];
    linkedinLink: string;
    githubLink:string
};

export interface IAddUserDetails {
    addUserDetails(details:details, email:string): Promise<{success:boolean}>
}

export interface IEditUserDetails {
    editUserDetails (details:Details, id:string): Promise<{success:boolean}>
}

export interface IGetUserDetails {
    getUserDetails(email:string): Promise<Details | null>
}

export interface IGetGithubDetails {
    getGithubDetails(user:string): Promise<any>
    getGithubRepoDetails(user:string): Promise<any>
}