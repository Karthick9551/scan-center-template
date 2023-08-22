import { query, body } from "express-validator";
import db from "../../../models/index.js";
import { destroy } from "./libs/destroy.js";
import { read } from "./libs/read.js";
import itemExists from "./libs/itemExists.js";
import { description } from "./libs/description.js";
import filters from "./libs/filters.js";
const { Scan } = db;
// name, description
const commonRules = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Scan name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Scan name must be between 2 and 50 characters")
        .bail()
        .custom(async (name, { req }) => {
        const scan = await Scan.findOne({ where: { name } });
        if (itemExists(scan, req.body.id)) {
            return Promise.reject("A Scan with this name already exists");
        }
        return true;
    }),
    body("amount")
        .trim()
        .notEmpty()
        .withMessage("Amount is required")
        .isDecimal({ decimal_digits: "1,2" })
        .withMessage("Amount must not exceeding 2 decimal places")
        .isFloat({ min: 0 })
        .withMessage("Amount cannot be negative")
        .toFloat(),
    description,
];
export const scanRules = {
    filter: [query("name").optional({ checkFalsy: true }).trim(), ...filters],
    create: commonRules,
    read: [read("Scan")],
    update: [
        body("id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Scan id is required")
            .custom(async (id) => {
            const scan = await Scan.findByPk(id);
            if (scan === null) {
                throw new Error("Scan not found");
            }
            return true;
        }),
        ...commonRules,
    ],
    destroy: [destroy("Scan", async (pk) => await Scan.findByPk(pk))],
};
