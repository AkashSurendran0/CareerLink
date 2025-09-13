import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/Sequelize";

export class UserModel extends Model {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public suspended!: boolean
}

UserModel.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username:{
            type: DataTypes.STRING
        },
        email:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        },
        suspended:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true
    }
)