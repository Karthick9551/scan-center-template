import { DataTypes, Model } from "sequelize";
export class User extends Model {
    static associate(models) { }
}
export const UserFactory = (sequelize) => {
    return User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            // unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(10),
            // unique: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.UUID,
            unique: false,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.UUID,
            unique: false,
            allowNull: true,
        },
    }, {
        tableName: "Users",
        sequelize,
    });
};
