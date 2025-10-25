import mongoose, {Document, Schema, Model} from "mongoose";

export interface IJobDetails extends Document {
    company:string,
    jobTitle:string,
    department:string,
    jobType:string,
    location:string,
    jobDescription:string,
    qualifications:string[],
    responsibilities:string[],
    benefits:string[],
    experienceLevel:string,
    education:string,
    deadline:Date
}

const jobSchema: Schema<IJobDetails> = new Schema (
    {
        company:{
            type:String,
            required:true
        },
        jobTitle:{
            type:String,
            required:true
        },
        department:{
            type:String,
            required:true
        },
        jobType:{
            type:String,
            required:true
        },
        location:{
            type:String,
            requried:true
        },
        jobDescription:{
            type:String,
            required:true
        },
        qualifications:[{
            type:String,
            required:true
        }],
        responsibilities:[{
            type:String,
            required:true
        }],
        benefits:[{
            type:String,
            rquired:false
        }],
        experienceLevel:{
            type:String,
            required:true
        },
        deadline:{
            type:Date,
            required:true
        }
    },
    {timestamps:true}
)

export const JobModel: Model<IJobDetails> = mongoose.model<IJobDetails>('JobDetails', jobSchema)