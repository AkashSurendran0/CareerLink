import mongoose, {Document, Schema, Model} from "mongoose";

export interface IJobApplications extends Document{
    jobPost:string,
    applicants:[{
        user:string,
        resume:string,
        coverLetter:string,
        status:string,
        createdAt:Date
    }]
}

const jobApplicationSchema: Schema<IJobApplications>=new Schema(
    {
        jobPost:{
            type:String,
            required:true
        },
        applicants:[
            {
                user:{
                    type:String,
                    required:true
                },
                resume:{
                    type:String,
                    required:true
                },
                coverLetter:{
                    type:String,
                    required:true
                },
                status:{
                    type:String,
                    default:'Pending'
                },
                createdAt:{
                    type:Date,
                    default:Date.now()
                }
            }
        ]
    },
    {timestamps:true}
)

export const JobApplicationModel:Model<IJobApplications> = mongoose.model<IJobApplications>('JobApplications', jobApplicationSchema)