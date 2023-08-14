import db from "../../models/index.js";
const { Patient } = db;
async function patients(req, res, next) {
    try {
        const { filter, pagination } = res.locals;
        const { count, rows } = await Patient.findAndCountAll({ ...filter });
        if (count) {
            pagination.count = count;
            return res.status(200).json({ patients: rows, pagination });
        }
        else {
            return res.status(400).json({
                error: "No scans found",
            });
        }
    }
    catch (error) {
        console.log("\n\nError getting patients:", error, "\n\n");
        next({ status: 500, error: "Db error getting patients" });
    }
}
async function create(req, res, next) {
    try {
        const { phone } = req.body;
        const otp = "1234";
        let patient = await Patient.findOne({ where: { phone } });
        if (patient && patient.phone) {
            const [affectedRows] = await Patient.update({
                phone,
                otp,
            }, { where: { phone } });
            if (affectedRows !== 1) {
                return res.status(400).json({
                    error: "Failed to send OTP. Please try again",
                });
            }
            else {
                return res.status(200).json({ patient });
            }
        }
        else {
            patient = await Patient.create({
                phone,
                otp,
            });
            if (patient.dataValues) {
                return res.status(201).json({ patient });
            }
            else {
                return res.status(400).json({
                    error: "Failed to send OTP. Please try again",
                });
            }
        }
    }
    catch (error) {
        console.log("\n\nError creating OTP: ", error, "\n\n");
        next({ status: 500, error: "Db error creating OTP" });
    }
}
async function read(req, res, next) {
    try {
        const category = await Patient.findByPk(req.params.id);
        if (category === null) {
            return res.status(400).json({
                error: "Patient not found",
            });
        }
        else {
            return res.status(200).json({ category });
        }
    }
    catch (error) {
        console.log("\n\nError getting patient: ", error, "\n\n");
        next({ status: 500, error: "Db error getting patient" });
    }
}
async function update(req, res, next) {
    try {
        const { id, phone, email } = req.body;
        const [affectedRows] = await Patient.update({ phone, email }, { where: { id } });
        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "Patient not updated. Please try again",
            });
        }
        else {
            const scan = await Patient.findByPk(id);
            return res.status(200).json({ scan });
        }
    }
    catch (error) {
        console.log("\n\nError updating patient: ", error, "\n\n");
        next({ status: 500, error: "Db error updating patient" });
    }
}
async function destroy(req, res, next) {
    try {
        const { id } = req.params;
        const affectedRows = await Patient.destroy({ where: { id } });
        if (affectedRows !== id.length) {
            const notDeleted = id.length - affectedRows;
            return res.status(400).json({
                error: `${notDeleted > 1 ? `${notDeleted} patient` : "patient"} not deleted. Please try again`,
            });
        }
        else {
            return res.status(200).json({
                message: `${id.length > 1 ? `${id.length} patient` : "patient"} deleted successfully`,
            });
        }
    }
    catch (error) {
        console.log("\n\nError deleting patient ", error, "\n\n");
        next({ status: 500, error: "Db error deleting patient" });
    }
}
async function verifyOTP(req, res, next) {
    try {
        const { phone, otp } = req.body;
        let patient = await Patient.findOne({ where: { phone, otp } });
        if (patient && patient.phone) {
            return res.status(200).json({ patient });
        }
        else {
            return res.status(400).json({
                error: "Invalid OTP. Please enter the correct OTP.",
            });
        }
    }
    catch (error) {
        console.log("\n\nError creating OTP: ", error, "\n\n");
        next({ status: 500, error: "Db error verifying OTP" });
    }
}
export { patients, create, read, update, destroy, verifyOTP };
