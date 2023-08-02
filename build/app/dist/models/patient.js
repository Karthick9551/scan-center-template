import { DataTypes, Model } from "sequelize";
export class Patient extends Model {
    static associate(models) { }
}
export const PatientFactory = (sequelize) => {
    return Patient.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(10),
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        otp: {
            type: DataTypes.STRING,
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
        tableName: "Patients",
        sequelize,
    });
};
