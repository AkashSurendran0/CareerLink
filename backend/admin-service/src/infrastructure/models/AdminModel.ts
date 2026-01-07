import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/Sequelize";

export class AdminModel extends Model {
    public id!: number;
    public email!: string;
    public password!: string;
}

AdminModel.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName:"admins",
        timestamps:true
    }
);