import mongoose, {Document, Schema, Model} from "mongoose";

export interface ICountModel extends Document {
    user:string,
    resume:number,
    coverLetter:number,
    tailoredResume:number,
    tailoredCoverLetter:number
}
    
const countSchema: Schema<ICountModel>=new Schema(
    {
        user:{
            type:String,
            required:true
        },
        resume:{
            type:Number,
            default:0
        },
        coverLetter:{
            type:Number,
            default:0
        },
        tailoredResume:{
            type:Number,
            default:0
        },
        tailoredCoverLetter:{
            type:Number,
            default:0
        }
    }
);

export const CountModel:Model<ICountModel> = mongoose.model<ICountModel>("Count", countSchema);