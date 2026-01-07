import { ResumeDto } from "../dto/ResumeDto";

type ResumeRecord = {
    _id: string;
    user: string;
    resumes: Array<{ name: string; url: string; createdAt: Date }>;
};

export class ResumeMapper {
    static toDTO(resume: ResumeRecord) : ResumeDto {
        return {
            _id: resume._id,
            user: resume.user,
            resumes: resume.resumes.map((item) => ({
                name: item.name,
                url: item.url,
                createdAt: item.createdAt
            }))
        };
    }
}