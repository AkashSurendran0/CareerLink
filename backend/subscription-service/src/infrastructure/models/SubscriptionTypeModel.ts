import mongoose, {Document, Schema, Model} from "mongoose";

export interface IFeature extends Document {    
    text:string,
    code:string
}

export interface ISubscriptionTypes extends Document {
    name:string,
    amount:number,
    billingCycle:number,
    features:IFeature[],
    active:boolean,
}

const subscriptionTypeSchema: Schema<ISubscriptionTypes> = new Schema (
    {
        name:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        billingCycle:{
            type:Number,
            required:true
        },
        features:[{
            text:{
                type:String,
                required:true
            },
            code:{
                type:String,
                required:true
            }
        }],
        active:{
            type:Boolean,
            required:true
        }
    },
    {timestamps:true}
);

export const SubscriptionTypesModel: Model<ISubscriptionTypes> = mongoose.model<ISubscriptionTypes>("SubscriptionTypes", subscriptionTypeSchema);