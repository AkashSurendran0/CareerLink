import { sequelize } from "../database/Sequelize";
import { DataTypes, Model } from "sequelize";

export class SubscriptionModel extends Model {
    public id!:number;
    public user!:string;
    public subscriptionType!:string;
    public validTill!:Date;
    
    public readonly createdAt!:Date;
}

SubscriptionModel.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        user:{
            type:DataTypes.STRING,
        },
        subscriptionType:{
            type:DataTypes.STRING
        },
        validTill:{
            type:DataTypes.DATE
        }
    },
    {
        sequelize,
        tableName:"subscriptions",
        timestamps:true
    }
);
