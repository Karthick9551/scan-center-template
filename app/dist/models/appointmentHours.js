import { DataTypes, Model, } from "sequelize";
export class AppointmentHours extends Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: "createdByUser",
            foreignKey: {
                name: "createdBy",
                allowNull: false,
            },
        });
        this.belongsTo(models.User, {
            as: "updatedByUser",
            foreignKey: {
                name: "updatedBy",
                allowNull: false,
            },
        });
    }
}
export const AppointmentHoursFactory = (sequelize) => {
    return AppointmentHours.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        weekDay: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.TIME,
            unique: false,
            allowNull: true,
        },
        endTime: {
            type: DataTypes.TIME,
            unique: false,
            allowNull: true,
        },
        isOpen: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName: "AppointmentHours",
        sequelize,
    });
};
