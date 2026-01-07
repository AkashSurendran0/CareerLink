import { RepoDTO } from "../../dto/RepoDTO";

type details = {
    gender: string,
    location: string,
    proficiency: string,
    aboutMe: string,
    experience: string,
    skills: string,
    education: string,
    linkedinLink: string,
    githubLink: string
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
    profilePicture?: string | undefined;
    gender?: string | undefined;
    aboutMe?: string | undefined;
    location?: string | undefined,
    proficiency?: string | undefined,
    skills?: string[] | undefined;
    education?: Education[] | undefined;
    experience?: Experience[] | undefined;
    linkedinLink?: string | undefined;
    githubLink?: string | undefined
};

export interface IAddUserDetails {
    addUserDetails(details: details, email: string): Promise<{ success: boolean }>
}

export interface IEditUserDetails {
    editUserDetails(details: Details, id: string): Promise<{ success: boolean }>
}

export interface IGetUserDetails {
    getUserDetails(id: string): Promise<Details | null>
}

export type GithubDetails = { name: string; image: string; followers: number; following: number; repos: number; totalStars?: number };
export type HeatmapItem = { date: string; count: number; color: string };

export interface IGetGithubDetails {
    getGithubDetails(user: string): Promise<{ success: boolean; details?: GithubDetails }>
    getGithubHeatmap(user: string): Promise<{ success: boolean; heatmap?: HeatmapItem[] }>
    getGithubRepoDetails(page: number, user: string, limit: number): Promise<{ success: boolean, data?: RepoDTO[] } | { success: boolean }>
}