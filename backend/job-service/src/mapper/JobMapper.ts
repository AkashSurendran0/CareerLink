import { JobDTO } from "../dto/JobDTO";
import { IJobDetails } from "../infrastructure/model/JobModel";
import mongoose from "mongoose";

export type JobSource = Partial<IJobDetails> & { _id?: string | mongoose.Types.ObjectId };

export class JobMapper {
    static toDTO(job: JobSource): JobDTO {
        return {
            _id: String(job._id),
            company: String(job.company),
            open: Boolean(job.open),
            jobTitle: String(job.jobTitle ?? ""),
            department: String(job.department ?? ""),
            jobType: String(job.jobType ?? ""),
            location: String(job.location ?? ""),
            jobDescription: String(job.jobDescription ?? ""),
            qualifications: job.qualifications ?? [],
            responsibilities: job.responsibilities ?? [],
            benefits: job.benefits ?? [],
            experienceLevel: String(job.experienceLevel ?? ""),
            deadline: job.deadline,
            createdAt: job.createdAt
        };
    }
}