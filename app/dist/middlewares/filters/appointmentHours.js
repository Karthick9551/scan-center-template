import Sequelize from "sequelize";
import processFilters from "./processFilters.js";
const Op = Sequelize.Op;
export function appointmentHours(req, res, next) {
    const { weekDay } = req.query;
    const conditions = [];
    if (weekDay) {
        conditions.push({
            weekDay: {
                [Op.iLike]: `%${weekDay}%`,
            },
        });
    }
    processFilters(req, res, next, conditions);
}
