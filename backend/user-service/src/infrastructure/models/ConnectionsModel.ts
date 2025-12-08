import mongoose, {Document, Schema, Model} from "mongoose";

export interface IConnections extends Document {
    user: string,
    pending: string[],
    connections: string[]
}

const connectionSchema: Schema<IConnections> = new Schema (
    {
        user:{
            type:String,
            required:true
        },
        pending:[{
            type:String
        }],
        connections:[{
            type:String
        }]
    }
);

export const ConnectionModel: Model<IConnections> = mongoose.model<IConnections>("Connections", connectionSchema);