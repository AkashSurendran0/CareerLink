import { sequelize } from "../database/Sequelize";
import { DataTypes, Model } from "sequelize";

export class ReportModel extends Model {
    public id!:string;
    public reportedBy!:string;
    public reportedChat?:string;
    public reportedAccount?:string;
    public reportedCompany?:string;
    public reason!:string;
    public status!:string;

    public readonly createdAt!:Date
}

ReportModel.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        reportedBy:{
            type:DataTypes.STRING
        },
        reportedChat:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        reportedAccount:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        reportedCompany:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        reason:{
            type:DataTypes.STRING,
        },
        status:{
            type:DataTypes.STRING,
            defaultValue:'Pending'
        },
    },
    {
        sequelize,
        tableName:'reports',
        timestamps:true
    }
)