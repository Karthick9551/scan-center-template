import { 
// BelongsToGetAssociationMixin,
// BelongsToSetAssociationMixin,
// BelongsToCreateAssociationMixin,
DataTypes, Model, } from "sequelize";
export class Appointment extends Model {
    static associate(models) {
        // this.belongsTo(models.Scan, {
        //   as: "scan",
        //   foreignKey: {
        //     name: "scanId",
        //     allowNull: false,
        //   },
        //   onDelete: "CASCADE",
        //   onUpdate: "CASCADE",
        // });
        this.hasMany(models.AppointmentScan, {
            as: "scans",
            foreignKey: {
                name: "appointmentId",
                allowNull: false,
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
export const AppointmentFactory = (sequelize) => {
    return Appointment.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(10),
            unique: false,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        patientName: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        patientAge: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        patientGender: {
            type: DataTypes.ENUM("M", "F", "O"),
            allowNull: false,
        },
        referringDoctorName: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            unique: false,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            unique: false,
            allowNull: false,
        },
        advanceAmount: {
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: true,
            defaultValue: 0,
        },
        isAdvancePaid: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: false,
            defaultValue: false,
        },
        totalAmount: {
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: true,
            defaultValue: 0,
        },
        isTotalAmountPaid: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: true,
            defaultValue: false,
        },
        token: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
            defaultValue: 0,
        },
        report: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: false,
            defaultValue: false,
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
        tableName: "Appointments",
        sequelize,
    });
};
