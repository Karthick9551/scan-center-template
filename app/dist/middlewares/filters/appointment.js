import Sequelize from "sequelize";
import processFilters from "./processFilters.js";
import moment from "moment";
const Op = Sequelize.Op;
export function appointment(req, res, next) {
    const { phone, email, patientName, referringDoctorName, fromDate, toDate, token, scanId, } = req.query;
    const conditions = [];
    if (phone) {
        conditions.push({
            phone: {
                [Op.iLike]: `%${phone}%`,
            },
        });
    }
    if (email) {
        conditions.push({
            email: {
                [Op.iLike]: `%${email}%`,
            },
        });
    }
    if (patientName) {
        conditions.push({
            patientName: {
                [Op.iLike]: `%${patientName}%`,
            },
        });
    }
    if (referringDoctorName) {
        conditions.push({
            referringDoctorName: {
                [Op.iLike]: `%${referringDoctorName}%`,
            },
        });
    }
    if (fromDate) {
        conditions.push({
            date: { [Op.gte]: fromDate },
        });
    }
    if (toDate) {
        conditions.push({
            date: {
                [Op.lte]: moment(toDate.toString()).add(1, "days").format("YYYY-MM-DD"),
            },
        });
    }
    if (token) {
        conditions.push({
            token: {
                [Op.eq]: token,
            },
        });
    }
    if (scanId) {
        conditions.push({
            scanId: {
                [Op.eq]: scanId,
            },
        });
    }
    processFilters(req, res, next, conditions);
}
