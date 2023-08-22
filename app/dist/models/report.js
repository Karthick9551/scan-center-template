import { Model, DataTypes, } from "sequelize";
export class Report extends Model {
    static associate(models) {
        this.belongsTo(models.Appointment, {
            as: "appointment",
            foreignKey: {
                name: "appointmentId",
                allowNull: false,
            },
        });
    }
}
export const ReportFactory = (sequelize) => {
    return Report.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "Reports",
        sequelize,
    });
};
