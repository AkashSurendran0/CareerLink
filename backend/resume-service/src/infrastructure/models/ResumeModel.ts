import mongoose, {Document, Schema, Model} from "mongoose";

export interface IResume extends Document{
    user:string,
    resumes:[{
        name:string,
        url:string,
        createdAt:Date
    }],
}

const resumeSchema: Schema<IResume>=new Schema(
    {
        user:{
            type:String,
            reqiured:true
        },
        resumes:[
            {
                name:{
                    type:String,
                    required:true
                },
                url:{
                    type:String,
                    required:true
                },
                createdAt:{
                    type:Date,
                    default:Date.now(),
                    required:true
                }
            }
        ]
    }
)

export const ResumeModel:Model<IResume> = mongoose.model<IResume>('Resume', resumeSchema)