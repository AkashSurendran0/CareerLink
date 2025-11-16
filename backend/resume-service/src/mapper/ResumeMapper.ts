import { ResumeDto } from "../dto/ResumeDto";

export class ResumeMapper {
    static toDTO(resume:any) : ResumeDto {
        return {
            _id:resume._id,
            user:resume.user,
            resumes: resume.resumes.map((item: any) => ({
                name: item.name,
                url: item.url,
                createdAt: item.createdAt
            }))
        }
    }
}