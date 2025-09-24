import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/Sequelize";

export class UserModel extends Model {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public googleId!: string;
    public suspended!: boolean;

    public readonly createdAt!:Date;
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
            allowNull: true
        },
        googleId:{
            type: DataTypes.STRING,
            allowNull: true
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
);