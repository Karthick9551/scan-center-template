import { Model, DataTypes, } from "sequelize";
export class AppointmentScan extends Model {
    static associate(models) {
        this.belongsTo(models.Appointment, {
            as: "appointment",
            foreignKey: {
                name: "appointmentId",
                allowNull: false,
            },
        });
        this.belongsTo(models.Scan, {
            as: "scan",
            foreignKey: {
                name: "scanId",
                allowNull: false,
            },
        });
    }
}
export const AppointmentScanFactory = (sequelize) => {
    return AppointmentScan.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
    }, {
        tableName: "AppointmentScans",
        sequelize,
    });
};
