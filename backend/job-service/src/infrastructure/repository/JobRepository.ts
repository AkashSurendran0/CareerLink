import mongoose from 'mongoose'
import { Job } from "../../domain/enitity/Job"
import { IJobRepository } from "../../domain/repositories/IJobRepository"
import { JobModel } from "../model/JobModel"

type JobDetails = {
    jobTitle: string,
    department: string,
    jobType: string,
    location: string,
    jobDescription: string,
    experienceLevel: string,
    applicationDeadline: Date,
    finalQualifications: string[],
    finalResponsibilities: string[],
    finalBenefits: string[] | null
}

export class JobRepository implements IJobRepository {

    async addJob(jobDetails: JobDetails, id: string): Promise<{ success: boolean }> {
        // create() at DB boundary; using `any` for DB result
        const created: any = await JobModel.create({
            company: id,
            open: true,
            jobTitle: jobDetails.jobTitle,
            department: jobDetails.department,
            jobType: jobDetails.jobType,
            location: jobDetails.location,
            jobDescription: jobDetails.jobDescription,
            qualifications: jobDetails.finalQualifications,
            responsibilities: jobDetails.finalResponsibilities,
            benefits: jobDetails.finalBenefits ?? [],
            experienceLevel: jobDetails.experienceLevel,
            deadline: jobDetails.applicationDeadline
        })
        // created saved; return success
        return { success: true }
    }

    async getAllJobs(id: string, filter: string): Promise<Job[]> {
        let jobs: any[]
        if (filter == 'all') {
            jobs = await JobModel.find({ company: id }).lean().exec()
        } else if (filter == 'open') {
            jobs = await JobModel.find({ company: id, open: true }).lean().exec()
        } else {
            jobs = await JobModel.find({ company: id, open: false }).lean().exec()
        }
        return jobs.map((job: any) =>
            new Job(
                String(job._id),
                job.company,
                Boolean(job.open),
                job.jobTitle,
                job.department,
                job.jobType,
                job.location,
                job.jobDescription,
                job.qualifications ?? [],
                job.responsibilities ?? [],
                job.benefits ?? [],
                job.experienceLevel,
                job.deadline,
                job.createdAt
            )
        )
    }

    async findDetails(id: string): Promise<Job> {
        const filter: any = mongoose.Types.ObjectId.isValid(id) ? { _id: new mongoose.Types.ObjectId(id) } : { _id: id }
        const job: any = await JobModel.findOne(filter).lean().exec()
        if (!job) {
            throw new Error("Job not found")
        }
        return new Job(
            String(job._id),
            job.company,
            Boolean(job.open),
            job.jobTitle,
            job.department,
            job.jobType,
            job.location,
            job.jobDescription,
            job.qualifications ?? [],
            job.responsibilities ?? [],
            job.benefits ?? [],
            job.experienceLevel,
            job.deadline,
            job.createdAt
        )
    }

    async editJob(jobDetails: any): Promise<{ success: boolean; }> {
        const filter: any = mongoose.Types.ObjectId.isValid(jobDetails._id) ? { _id: new mongoose.Types.ObjectId(jobDetails._id) } : { _id: jobDetails._id }
        await JobModel.updateOne(
            filter,
            {
                $set: jobDetails
            }
        )
        return { success: true }
    }

    async closeJob(id: string): Promise<{ success: boolean; }> {
        const filter: any = mongoose.Types.ObjectId.isValid(id) ? { _id: new mongoose.Types.ObjectId(id) } : { _id: id }
        await JobModel.updateOne(
            filter,
            {
                $set: { open: false }
            }
        )
        return { success: true }
    }

    async getAvailableJobs(query: string): Promise<Job[]> {
        let jobs: any[]
        if (query) {
            jobs = await JobModel.find({
                open: true,
                jobTitle: { $regex: new RegExp(query, 'i') }
            }).lean().exec()
        } else {
            jobs = await JobModel.find({ open: true }).lean().exec()
        }
        return jobs.map(job =>
            new Job(
                String(job._id),
                job.company,
                Boolean(job.open),
                job.jobTitle,
                job.department,
                job.jobType,
                job.location,
                job.jobDescription,
                job.qualifications ?? [],
                job.responsibilities ?? [],
                job.benefits ?? [],
                job.experienceLevel,
                job.deadline,
                job.createdAt
            )
        )
    }

    async getQueryJobs(id: string, start: number, limit: number, query: string | undefined, filter: string): Promise<Job[]> {
        let jobs: any[]
        const matchBase: any = { company: `${id}` }
        if (query) matchBase.jobTitle = { $regex: new RegExp(query, 'i') }
        if (filter === 'open') matchBase.open = true
        if (filter === 'closed') matchBase.open = false

        jobs = await JobModel.aggregate([
            { $match: matchBase },
            { $skip: (start - 1) * limit },
            { $limit: limit }
        ])

        return jobs.map(job =>
            new Job(
                String(job._id),
                job.company,
                Boolean(job.open),
                job.jobTitle,
                job.department,
                job.jobType,
                job.location,
                job.jobDescription,
                job.qualifications ?? [],
                job.responsibilities ?? [],
                job.benefits ?? [],
                job.experienceLevel,
                job.deadline,
                job.createdAt
            )
        )
    }

    async getJobAnalytics(): Promise<any> {
        const result = await JobModel.aggregate([
            {
                $group: {
                    _id: '$company',
                    count: { $sum: 1 }
                },
            }
        ])
        return result
    }

}