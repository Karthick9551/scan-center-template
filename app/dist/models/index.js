import sequelize from "../config/config.js";
import { UserFactory } from "./user.js";
import { ScanFactory } from "./scan.js";
import { AppointmentHoursFactory } from "./appointmentHours.js";
import { PatientFactory } from "./patient.js";
import { AppointmentFactory } from "./appointment.js";
import { AppointmentScanFactory } from "./appointmentScan.js";
import { ReportFactory } from "./report.js";
const models = {
    User: UserFactory(sequelize),
    Scan: ScanFactory(sequelize),
    AppointmentHours: AppointmentHoursFactory(sequelize),
    Patient: PatientFactory(sequelize),
    Appointment: AppointmentFactory(sequelize),
    AppointmentScan: AppointmentScanFactory(sequelize),
    Report: ReportFactory(sequelize),
};
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associations) {
        models[modelName].associate(models);
    }
});
const db = {
    sequelize,
    ...models,
};
export default db;
