import { JobApplicationDto } from "../dto/JobApplicationDTO";
import { IJobApplications } from "../infrastructure/model/JobApplicationModel";
import mongoose from "mongoose";

type ApplicantSource = {
    _id?: string | mongoose.Types.ObjectId;
    user: string;
    resume?: string;
    coverLetter?: string;
    status?: string;
    createdAt?: Date;
}

type JobAppSource = Partial<IJobApplications> & { _id?: string | mongoose.Types.ObjectId };

export class JobApplicationMapper {
    static toDTO (job: JobAppSource) : JobApplicationDto {
        return {
            _id: String(job._id),
            jobPost: String(job.jobPost),
            applicants: (job.applicants ?? []).map((item: ApplicantSource) => ({
                _id: item._id ? String(item._id) : undefined,
                user: String(item.user),
                resume: item.resume,
                coverLetter: item.coverLetter,
                status: item.status,
                createdAt: item.createdAt
            }))
        };
    }
}