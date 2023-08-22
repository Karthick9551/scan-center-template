import db from "../../models/index.js";
const { AppointmentHours, Appointment } = db;
async function appointmentHourses(req, res, next) {
    try {
        const { filter, pagination } = res.locals;
        const { count, rows } = await AppointmentHours.findAndCountAll({
            ...filter,
        });
        if (count) {
            pagination.count = count;
            return res.status(200).json({ appointmentHourses: rows, pagination });
        }
        else {
            return res.status(400).json({
                error: "No AppointmentHours found",
            });
        }
    }
    catch (error) {
        console.log("\n\nError getting AppointmentHours:", error, "\n\n");
        next({ status: 500, error: "Db error getting AppointmentHours" });
    }
}
async function create(req, res, next) {
    try {
        const { weekDay, startTime, endTime, isOpen } = req.body;
        const reqUser = req.headers["user-id"]
            ? req.headers["user-id"].toString()
            : "";
        const appointmentHours = await AppointmentHours.create({
            weekDay,
            startTime,
            endTime,
            isOpen: isOpen ? true : false,
            createdBy: reqUser,
            updatedBy: reqUser,
        });
        if (appointmentHours.dataValues) {
            return res.status(201).json({ appointmentHours });
        }
        else {
            return res.status(400).json({
                error: "AppointmentHours not created. Please try again",
            });
        }
    }
    catch (error) {
        console.log("\n\nError creating AppointmentHours: ", error, "\n\n");
        next({ status: 500, error: "Db error creating AppointmentHours" });
    }
}
async function read(req, res, next) {
    try {
        const appointmentHours = await AppointmentHours.findByPk(req.params.id);
        if (appointmentHours === null) {
            return res.status(400).json({
                error: "AppointmentHours not found",
            });
        }
        else {
            return res.status(200).json({ appointmentHours });
        }
    }
    catch (error) {
        console.log("\n\nError getting AppointmentHours: ", error, "\n\n");
        next({ status: 500, error: "Db error getting AppointmentHours" });
    }
}
async function update(req, res, next) {
    try {
        const { id, weekDay, startTime, endTime, isOpen } = req.body;
        const reqUser = req.headers["user-id"]
            ? req.headers["user-id"].toString()
            : "";
        const [affectedRows] = await AppointmentHours.update({
            weekDay,
            startTime,
            endTime,
            isOpen: isOpen ? true : false,
            updatedBy: reqUser,
        }, { where: { id } });
        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "AppointmentHours not updated. Please try again",
            });
        }
        else {
            const appointmentHours = await AppointmentHours.findByPk(id);
            return res.status(200).json({ appointmentHours });
        }
    }
    catch (error) {
        console.log("\n\nError updating AppointmentHours: ", error, "\n\n");
        next({ status: 500, error: "Db error updating AppointmentHours" });
    }
}
async function destroy(req, res, next) {
    try {
        const { id } = req.params;
        const affectedRows = await AppointmentHours.destroy({ where: { id } });
        if (affectedRows !== id.length) {
            const notDeleted = id.length - affectedRows;
            return res.status(400).json({
                error: `${notDeleted > 1
                    ? `${notDeleted} appointmentHourses`
                    : "AppointmentHours"} not deleted. Please try again`,
            });
        }
        else {
            return res.status(200).json({
                message: `${id.length > 1 ? `${id.length} appointmentHourses` : "AppointmentHours"} deleted successfully`,
            });
        }
    }
    catch (error) {
        console.log("\n\nError deleting AppointmentHours ", error, "\n\n");
        next({ status: 500, error: "Db error deleting AppointmentHours" });
    }
}
async function getTime(req, res, next) {
    try {
        const date = req.params.date;
        if (date) {
            const dateObj = new Date(date);
            let day = "";
            switch (dateObj.getDay()) {
                case 0:
                    day = "Sunday";
                    break;
                case 1:
                    day = "Monday";
                    break;
                case 2:
                    day = "Tuesday";
                    break;
                case 3:
                    day = "Wednesday";
                    break;
                case 4:
                    day = "Thursday";
                    break;
                case 5:
                    day = "Friday";
                    break;
                case 6:
                    day = "Saturday";
                    break;
            }
            const appointmentHours = await AppointmentHours.findOne({
                where: {
                    weekDay: day,
                },
            });
            if (appointmentHours === null ||
                !appointmentHours.startTime ||
                appointmentHours.startTime.length < 1 ||
                !appointmentHours.endTime ||
                appointmentHours.endTime.length < 1 ||
                !appointmentHours.isOpen) {
                return res.status(400).json({
                    error: "AppointmentHours not found",
                });
            }
            else {
                let availableTimes = [];
                let splitArray = appointmentHours.startTime.split(":");
                let hours = parseInt(splitArray[0]);
                let minutes = parseInt(splitArray[1]);
                let endSplitArray = appointmentHours.endTime.split(":");
                let endHours = parseInt(endSplitArray[0]);
                let endMinutes = parseInt(endSplitArray[1]);
                while (hours < endHours) {
                    availableTimes.push({
                        value: `${hours > 9 ? hours : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes}:00`,
                        label: `${hours > 9 ? (hours > 12 ? hours - 12 : hours) : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes} ${hours > 12 ? "PM" : "AM"}`,
                    });
                    if (minutes <= 15) {
                        minutes += 30;
                    }
                    else {
                        hours += 1;
                        minutes = 0;
                    }
                }
                const rows = await Appointment.findAll({
                    attributes: ["time"],
                    where: { date: dateObj },
                });
                if (rows && rows.length > 0) {
                    rows.map((a) => {
                        availableTimes = availableTimes.filter((at) => at.value !== a.time);
                    });
                }
                return res.status(200).json({ availableTimes });
            }
        }
        else {
            return res.status(400).json({
                error: "Date is required.",
            });
        }
    }
    catch (error) {
        console.log("\n\nError getting AppointmentHours: ", error, "\n\n");
        next({ status: 500, error: "Db error getting AppointmentHours" });
    }
}
export { appointmentHourses, create, read, update, destroy, getTime };
