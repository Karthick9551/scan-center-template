import { DataTypes, Model, } from "sequelize";
export class Scan extends Model {
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
export const ScanFactory = (sequelize) => {
    return Scan.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0,
        },
        description: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName: "Scans",
        sequelize,
    });
};
