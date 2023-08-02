import db from "../../models/index.js";
const { Appointment } = db;
async function appointments(req, res, next) {
    try {
        const { filter, pagination } = res.locals;
        const { count, rows } = await Appointment.findAndCountAll({ ...filter });
        if (count) {
            pagination.count = count;
            return res.status(200).json({ appointments: rows, pagination });
        }
        else {
            return res.status(400).json({
                error: "No appointments found",
            });
        }
    }
    catch (error) {
        console.log("\n\nError getting appointments:", error, "\n\n");
        next({ status: 500, error: "Db error getting appointments" });
    }
}
async function create(req, res, next) {
    try {
        const { phone, patientName, patientAge, patientGender, referringDoctorName, date, time, advanceAmount, totalAmount, scanId, } = req.body;
        const appointment = await Appointment.create({
            advanceAmount,
            date,
            patientAge,
            patientGender,
            patientName,
            phone,
            referringDoctorName,
            scanId,
            time,
            totalAmount,
            status: 0,
            isActive: true,
        });
        if (appointment.dataValues) {
            return res.status(201).json({ appointment });
        }
        else {
            return res.status(400).json({
                error: "Appointment not created. Please try again",
            });
        }
    }
    catch (error) {
        console.log("\n\nError creating Appointment: ", error, "\n\n");
        next({ status: 500, error: "Db error creating Appointment" });
    }
}
async function read(req, res, next) {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (appointment === null) {
            return res.status(400).json({
                error: "Appointment not found",
            });
        }
        else {
            return res.status(200).json({ appointment });
        }
    }
    catch (error) {
        console.log("\n\nError getting Appointment: ", error, "\n\n");
        next({ status: 500, error: "Db error getting Appointment" });
    }
}
async function readByPhone(req, res, next) {
    try {
        const { phone } = req.params;
        const { filter, pagination } = res.locals;
        filter.where = { ...filter.where, phone };
        const { count, rows } = await Appointment.findAndCountAll({ ...filter });
        if (count) {
            pagination.count = count;
            return res.status(200).json({ appointments: rows, pagination });
        }
        else {
            return res.status(400).json({
                error: "No appointments found",
            });
        }
    }
    catch (error) {
        console.log("\n\nError getting Appointment: ", error, "\n\n");
        next({ status: 500, error: "Db error getting Appointment" });
    }
}
async function update(req, res, next) {
    try {
        const { id, phone, email, patientName, patientAge, patientGender, referringDoctorName, date, time, } = req.body;
        const reqUser = req.headers["user-id"]
            ? req.headers["user-id"].toString()
            : "";
        const [affectedRows] = await Appointment.update({
            phone,
            email,
            patientName,
            patientAge,
            patientGender,
            referringDoctorName,
            date,
            time,
            updatedBy: reqUser,
        }, { where: { id } });
        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "Appointment not updated. Please try again",
            });
        }
        else {
            const appointment = await Appointment.findByPk(id);
            return res.status(200).json({ appointment });
        }
    }
    catch (error) {
        console.log("\n\nError updating Appointment: ", error, "\n\n");
        next({ status: 500, error: "Db error updating Appointment" });
    }
}
async function destroy(req, res, next) {
    try {
        const { id } = req.params;
        const affectedRows = await Appointment.destroy({ where: { id } });
        if (affectedRows !== id.length) {
            const notDeleted = id.length - affectedRows;
            return res.status(400).json({
                error: `${notDeleted > 1 ? `${notDeleted} appointments` : "Appointment"} not deleted. Please try again`,
            });
        }
        else {
            return res.status(200).json({
                message: `${id.length > 1 ? `${id.length} appointments` : "Appointment"} deleted successfully`,
            });
        }
    }
    catch (error) {
        console.log("\n\nError deleting Appointment ", error, "\n\n");
        next({ status: 500, error: "Db error deleting Appointment" });
    }
}
async function updateStatus(req, res, next) {
    try {
        const { id, status } = req.body;
        const reqUser = req.headers["user-id"]
            ? req.headers["user-id"].toString()
            : "";
        const [affectedRows] = await Appointment.update({ status, updatedBy: reqUser }, { where: { id } });
        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "Appointment Status not updated. Please try again",
            });
        }
        else {
            const appointment = await Appointment.findByPk(id);
            return res.status(200).json({ appointment });
        }
    }
    catch (error) {
        console.log("\n\nError updating Appointment Status: ", error, "\n\n");
        next({ status: 500, error: "Db error updating Appointment Status" });
    }
}
async function updatePayment(req, res, next) {
    try {
        const { id, date, isAdvancePaid, isTotalAmountPaid } = req.body;
        const lastToken = await Appointment.max("token", {
            where: { date: new Date(date) },
        });
        const [affectedRows] = await Appointment.update({ isAdvancePaid, isTotalAmountPaid, token: lastToken + 1, status: 1 }, { where: { id } });
        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "Appointment Payment not updated. Please try again",
            });
        }
        else {
            const appointment = await Appointment.findByPk(id);
            return res.status(200).json({ appointment });
        }
    }
    catch (error) {
        console.log("\n\nError updating Appointment Payment: ", error, "\n\n");
        next({ status: 500, error: "Db error updating Appointment Payment" });
    }
}
export { appointments, create, read, readByPhone, update, destroy, updateStatus, updatePayment, };
