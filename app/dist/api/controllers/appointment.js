import Sequelize from "sequelize";
import multer from "multer";
import path from "path";
import db from "../../models/index.js";
const Op = Sequelize.Op;
const { Appointment, AppointmentScan, Scan } = db;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;
var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png|pdf|xls|xlsx|doc|docx/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the " +
            "following filetypes - " +
            filetypes);
    },
    // mypic is the name of file attribute
}).single("file");
async function appointments(req, res, next) {
    try {
        const { filter, pagination } = res.locals;
        const { count, rows } = await Appointment.findAndCountAll({
            distinct: true,
            include: [
                {
                    model: AppointmentScan,
                    as: "scans",
                    include: [
                        {
                            model: Scan,
                            as: "scan",
                        },
                    ],
                },
            ],
            ...filter,
        });
        if (rows && rows.length > 0) {
            pagination.count = rows.length;
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
        // return await sequelize.transaction(async (t) => {
        const appointment = await Appointment.create({
            advanceAmount,
            date,
            patientAge,
            patientGender,
            patientName,
            phone,
            referringDoctorName,
            // scanId,
            time,
            totalAmount,
            status: 0,
            isActive: true,
        }
        // { transaction: t }
        );
        if (appointment && appointment.id) {
            const { count, rows } = await Scan.findAndCountAll({
                distinct: true,
                where: {
                    id: { [Op.in]: scanId },
                },
                // transaction: t,
            });
            rows.map(async (s) => {
                // add scans in appointment scan table
                const affectedAppointmentScanRow = await AppointmentScan.create({
                    appointmentId: appointment.id,
                    scanId: s.id,
                }
                // { transaction: t }
                );
            });
            // const appointmentData = await Appointment.findByPk(appointment.id, {
            //   include: [
            //     {
            //       model: AppointmentScan,
            //       as: "scans",
            //       include: [
            //         {
            //           model: Scan,
            //           as: "scan",
            //         },
            //       ],
            //     },
            //   ],
            // });
            return res.status(201).json({ appointment });
        }
        else {
            return res.status(400).json({
                error: "Appointment not created. Please try again",
            });
        }
        // });
    }
    catch (error) {
        console.log("\n\nError creating Appointment: ", error, "\n\n");
        next({ status: 500, error: "Db error creating Appointment" });
    }
}
async function read(req, res, next) {
    try {
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                {
                    model: AppointmentScan,
                    as: "scans",
                    include: [
                        {
                            model: Scan,
                            as: "scan",
                        },
                    ],
                },
            ],
        });
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
        const { count, rows } = await Appointment.findAndCountAll({
            include: [
                {
                    model: AppointmentScan,
                    as: "scans",
                    include: [
                        {
                            model: Scan,
                            as: "scan",
                        },
                    ],
                },
            ],
            ...filter,
        });
        if (rows && rows.length > 0) {
            pagination.count = rows.length;
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
        const { id, phone, email, patientName, patientAge, patientGender, referringDoctorName, date, time, scanId, report } = req.body;
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
            report,
            updatedBy: reqUser,
        }, { where: { id } });
        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "Appointment not updated. Please try again",
            });
        }
        else {
            const deletedAppointmentScanRows = await AppointmentScan.destroy({
                where: { appointmentId: id },
            });
            const { count, rows } = await Scan.findAndCountAll({
                distinct: true,
                where: {
                    id: { [Op.in]: scanId },
                },
            });
            rows.map(async (s) => {
                // add scans in appointment scan table
                const affectedAppointmentScanRow = await AppointmentScan.create({
                    appointmentId: id,
                    scanId: s.id,
                });
            });
            const appointment = await Appointment.findByPk(id, {
                include: [
                    {
                        model: AppointmentScan,
                        as: "scans",
                        include: [
                            {
                                model: Scan,
                                as: "scan",
                            },
                        ],
                    },
                ],
            });
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
        const affectedAppointmentScanRows = await AppointmentScan.destroy({
            where: { appointmentId: id },
        });
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
            const appointment = await Appointment.findByPk(id, {
                include: [
                    {
                        model: AppointmentScan,
                        as: "scans",
                        include: [
                            {
                                model: Scan,
                                as: "scan",
                            },
                        ],
                    },
                ],
            });
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
            const appointment = await Appointment.findByPk(id, {
                include: [
                    {
                        model: AppointmentScan,
                        as: "scans",
                        include: [
                            {
                                model: Scan,
                                as: "scan",
                            },
                        ],
                    },
                ],
            });
            return res.status(200).json({ appointment });
        }
    }
    catch (error) {
        console.log("\n\nError updating Appointment Payment: ", error, "\n\n");
        next({ status: 500, error: "Db error updating Appointment Payment" });
    }
}
async function uploadReport(req, res, next) {
    try {
        const { id } = req.params;
        const { fileName } = req.query;
        upload(req, res, async function (err) {
            if (err) {
                // ERROR occurred (here it can be occurred due
                // to uploading image of size greater than
                // 1MB or uploading different file type)
                // res.send(err);
                console.log("ERRRRRR::: ", err);
                next({
                    status: 500,
                    error: "Failed to upload a file. Please try again",
                });
            }
            else {
                // SUCCESS, image successfully uploaded
                // res.send("Success, Image uploaded!");
                const appointment = await Appointment.findByPk(id);
                if (appointment && appointment.id) {
                    let report = (appointment.report && appointment.report.length > 0
                        ? appointment.report
                        : "") +
                        (appointment.report && appointment.report.length > 0 ? "," : "") +
                        fileName;
                    const [affectedRows] = await Appointment.update({ report: report }, { where: { id } });
                    if (affectedRows !== 1) {
                        return res.status(400).json({
                            error: "Failed to upload a file. Please try again",
                        });
                    }
                    else {
                        const appointment = await Appointment.findByPk(id, {
                            include: [
                                {
                                    model: AppointmentScan,
                                    as: "scans",
                                    include: [
                                        {
                                            model: Scan,
                                            as: "scan",
                                        },
                                    ],
                                },
                            ],
                        });
                        return res.status(200).json({ appointment });
                    }
                }
                else {
                    next({ status: 500, error: "Appointmentnot found." });
                }
            }
        });
    }
    catch (error) {
        console.log("\n\nError updating Appointment Payment: ", error, "\n\n");
        next({ status: 500, error: "Db error updating Appointment Payment" });
    }
}
export { appointments, create, read, readByPhone, update, destroy, updateStatus, updatePayment, uploadReport, };
