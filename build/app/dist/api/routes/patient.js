import { default as express } from "express";
import * as patientController from "../controllers/patient.js";
import { patientRules } from "../../middlewares/validators/rules/patient.js";
import { validate } from "../../middlewares/validators/validate.js";
import filter from "../../middlewares/filters/index.js";
export const router = express.Router();
router
    .route("get/:id")
    .get(patientRules.read, validate, patientController.read);
router
    .route("delete/:id")
    .delete(patientRules.destroy, validate, patientController.destroy);
router
    .route("/")
    .get(patientRules.filter, validate, filter.patient, patientController.patients)
    .post(patientRules.create, patientController.create);
router
    .route("/verify")
    .post(patientRules.verifyOTP, patientController.verifyOTP);
