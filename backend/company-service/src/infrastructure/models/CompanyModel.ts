import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/Sequelize";

export class CompanyModel extends Model {
    public id!:string;
    public registeredBy!:string;
    public logo!:string;
    public name!:string;
    public companySize!:string;
    public foundedYear!:string;
    public industry!:string;
    public websiteURL!:string | null;
    public location!:string;
    public aboutCompany!:string;
    public approved!:boolean;
    public rejected!:boolean;
    public suspended!:boolean; 
    public rejectReasons!:string[] | null;

    public readonly createdAt?: Date;
}

CompanyModel.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
            type:DataTypes.STRING,
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
            type:DataTypes.TEXT,
            allowNull:false
        },
        approved:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        rejected:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        suspended:{
            type:DataTypes.BOOLEAN,
            defaultValue:false 
        },
        rejectReasons:{
            type:DataTypes.ARRAY(DataTypes.STRING),
            allowNull:true
        },
    },
    {
        sequelize,
        tableName: "companies",
        timestamps: true
    }
);