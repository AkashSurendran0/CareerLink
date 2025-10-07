import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/Sequelize";

export class CompanyModel extends Model {
    public id!:string;
    public registeredBy!:string;
    public logo!:string;
    public name!:string;
    public companySize!:number;
    public foundedYear!:number;
    public industry!:string;
    public websiteURL!:string;
    public location!:string;
    public aboutCompany!:string;
    public suspended!:boolean;

    public readonly createdAt!:Date
}

CompanyModel.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        registeredBy:{
            type:DataTypes.STRING,
            allowNull:false
        },
        logo:{
            type:DataTypes.STRING,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        companySize:{
            type:DataTypes.STRING,
            allowNull:false
        },
        foundedYear:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        industry:{
            type:DataTypes.STRING,
            allowNull:false
        },
        websiteURL:{
            type:DataTypes.STRING,
            allowNull:true
        },
        location:{
            type:DataTypes.STRING,
            allowNull:false
        },
        aboutCompany:{
            type:DataTypes.STRING,
            allowNull:false
        },
        suspended:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    },
    {
        sequelize,
        tableName: "companies",
        timestamps: true
    }
)