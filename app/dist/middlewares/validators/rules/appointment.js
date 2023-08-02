import { query, body } from "express-validator";
import db from "../../../models/index.js";
import { destroy } from "./libs/destroy.js";
import { read } from "./libs/read.js";
import toTitleCase from "../../../libs/toTitleCase.js";
import filters from "./libs/filters.js";
const { Appointment, Scan } = db;
const commonRules = [
    body("scanId")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Scan id is required")
        .bail()
        .custom(async (id) => {
        const scan = await Scan.findByPk(id);
        if (scan === null) {
            throw new Error("Scan not found");
        }
        return true;
    }),
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .isLength({ min: 10, max: 10 })
        .withMessage("A phone number must be 10 characters long")
        .isInt()
        .withMessage("A phone number must be numerical"),
    body("email")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage("Email must be between 5 and 40 characters long")
        .isEmail()
        .withMessage("Please provide a valid email address"),
    body("patientName")
        .trim()
        .notEmpty()
        .withMessage("Patient Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Patient Name must be between 2 and 50 characters")
        .bail()
        .customSanitizer((name) => {
        return toTitleCase(name);
    }),
    body("patientAge")
        .trim()
        .notEmpty()
        .withMessage("Patient Age is required")
        .isNumeric()
        .withMessage("Patient Age should be a number"),
    body("patientGender")
        .trim()
        .notEmpty()
        .withMessage("Patient Gender is required")
        .isAlpha()
        .withMessage("Patient Gender must be alphabetic")
        .isIn(["M", "F", "O"])
        .withMessage("Valid gender are 'M', 'F', 'O'"),
    body("date").trim().notEmpty().withMessage("Date is required"),
    body("time").trim().notEmpty().withMessage("Date is required"),
];
export const appointmentRules = {
    filter: [query("phone").optional({ checkFalsy: true }).trim(), ...filters],
    create: commonRules,
    read: [read("Appointment")],
    update: [
        body("id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Appointment id is required")
            .custom(async (id) => {
            const appointment = await Appointment.findByPk(id);
            if (appointment === null) {
                throw new Error("Appointment not found");
            }
            return true;
        }),
        ...commonRules,
    ],
    pay: [
        body("id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Appointment id is required")
            .custom(async (id) => {
            const appointment = await Appointment.findByPk(id);
            if (appointment === null) {
                throw new Error("Appointment not found");
            }
            return true;
        }),
    ],
    updateStatus: [
        body("id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Appointment id is required")
            .custom(async (id) => {
            const appointment = await Appointment.findByPk(id);
            if (appointment === null) {
                throw new Error("Appointment not found");
            }
            return true;
        }),
    ],
    destroy: [
        destroy("Appointment", async (pk) => await Appointment.findByPk(pk)),
    ],
};
