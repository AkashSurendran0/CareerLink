import mongoose, {Document, Schema, Model} from "mongoose";

export interface IPost extends Document {
    image:string | null,
    text: string | null,
    createdBy:string,
    comments:[{
        comment:string,
        by:string
    }],
    likes:number,
    likedBy:string[],
    createdAt:Date
}

const postSchema: Schema<IPost>=new Schema(
    {
        image:{
            type: String,
            required: false,
            default: null
        },
        text:{
            type: String,
            required: false,
            default: null
        },
        createdBy:{
            type:String,
            required:true
        },
        comments:[
            {
                comment:{
                    type:String,
                    required:false
                },
                by:{
                    type:String,
                    required:false
                },
                createdAt:{
                    type:Date,
                    required:false,
                    default:Date.now()
                }
            }
        ],
        likes:{
            type:Number,
            default:0
        },
        likedBy:[{
            type:String,
            required:false
        }]
    },
    {timestamps:true}
);

export const PostModel:Model<IPost> = mongoose.model<IPost>("Posts", postSchema);