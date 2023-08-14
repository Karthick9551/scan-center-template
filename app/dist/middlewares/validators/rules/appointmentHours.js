import { query, body } from "express-validator";
import db from "../../../models/index.js";
import { destroy } from "./libs/destroy.js";
import { read } from "./libs/read.js";
import filters from "./libs/filters.js";
const { AppointmentHours } = db;
const commonRules = [
    body("weekDay")
        .trim()
        .notEmpty()
        .withMessage("Week Day is required")
        .isAlpha()
        .withMessage("Week Day must be alphabetic")
        .isIn([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ])
        .withMessage("Valid Week Day's are 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'"),
];
export const appointmentHoursRules = {
    filter: [query("weekDay").optional({ checkFalsy: true }).trim(), ...filters],
    create: commonRules,
    read: [read("AppointmentHours")],
    update: [
        body("id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("AppointmentHours id is required")
            .custom(async (id) => {
            const appointmentHours = await AppointmentHours.findByPk(id);
            if (appointmentHours === null) {
                throw new Error("AppointmentHours not found");
            }
            return true;
        }),
        ...commonRules,
    ],
    destroy: [
        destroy("AppointmentHours", async (pk) => await AppointmentHours.findByPk(pk)),
    ],
};
