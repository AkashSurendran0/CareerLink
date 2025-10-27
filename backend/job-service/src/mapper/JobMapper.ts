import { JobDTO } from "../dto/JobDTO";

export class JobMapper {
    static toDTO(job:any): JobDTO {
        return {
            _id:job._id,
            company:job.company,
            open:job.open,
            jobTitle:job.jobTitle,
            department:job.department,
            jobType:job.jobType,
            location:job.location,
            jobDescription:job.jobDescription,
            qualifications:job.qualifications,
            responsibilities:job.responsibilities,
            benefits:job.benefits,
            experienceLevel:job.experienceLevel,
            deadline:job.deadline,
            createdAt:job.createdAt
        }
    }
}