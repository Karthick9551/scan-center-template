import { query, body } from "express-validator";
import db from "../../../models/index.js";
import { destroy } from "./libs/destroy.js";
import { read } from "./libs/read.js";
import filters from "./libs/filters.js";
const { Patient } = db;
// name, description
const commonRules = [
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone Number is required")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone Number must be 10 digits"),
];
export const patientRules = {
    filter: [query("phone").optional({ checkFalsy: true }).trim(), ...filters],
    create: commonRules,
    read: [read("Patient")],
    update: [
        body("id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Patient id is required")
            .custom(async (id) => {
            const patient = await Patient.findByPk(id);
            if (patient === null) {
                throw new Error("Patient not found");
            }
            return true;
        }),
        ...commonRules,
    ],
    destroy: [destroy("Patient", async (pk) => await Patient.findByPk(pk))],
    verifyOTP: [
        body("otp").trim().escape().notEmpty().withMessage("OTP id is required"),
        ...commonRules,
    ],
};
