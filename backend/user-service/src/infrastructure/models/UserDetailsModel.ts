import mongoose, {Document, Schema, Model} from "mongoose";

export interface IUserDetails extends Document {
    user:string,
    profilePicture:string,
    gender:string,
    aboutMe:string,
    location:string,
    proficiency:string,
    skills:[string],
    education:[string],
    experience:[string],
    linkedinLink:string,
    githubLink:string
}

const userDetailsSchema: Schema<IUserDetails> = new Schema (
    {
        user:{
            type: String,
            required: true
        },
        profilePicture:{
            type: String,
            required: false
        },
        gender:{
            type: String,
            required: false
        },
        aboutMe:{
            type: String,
            required: false
        },
        location:{
            type: String,
            required:false
        },
        proficiency:{
            type: String,
            required:false
        },
        skills:[{
            type: String,
            required: false
        }],
        education:[{
            degree:{
                type: String,
                required:false
            },
            university:{
                type: String,
                required: false
            },
            passingYear:{
                type: String,
                required:false
            }
        }],
        experience:[{
            company:{
                type:String,
                required:false
            },
            experience:{
                type:String,
                required:false
            }
        }],
        linkedinLink:{
            type: String,
            required: false
        },
        githubLink:{
            type: String,
            required: false
        },
    },
    {
        timestamps:true
    }
) 

export const UserDetailsModel: Model<IUserDetails> = mongoose.model<IUserDetails>("UserDetails", userDetailsSchema)