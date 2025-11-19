import { JobApplicationDto } from "../dto/JobApplicationDTO";

export class JobApplicationMapper {
    static toDTO (job:any) : JobApplicationDto {
        return {
            _id:job._id,
            jobPost:job.jobPost,
            applicants: job.applicants.map((item:any)=>({
                _id:item._id,
                user:item.user,
                resume:item.resume,
                coverLetter:item.coverLetter,
                status:item.status,
                createdAt:item.createdAt
            }))
        }
    }
}