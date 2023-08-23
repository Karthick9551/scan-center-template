import { default as express } from "express";
import * as appointmentController from "../controllers/appointment.js";
import { appointmentRules } from "../../middlewares/validators/rules/appointment.js";
import { validate } from "../../middlewares/validators/validate.js";
import filter from "../../middlewares/filters/index.js";
export const router = express.Router();
router.route("/get/:id").get(appointmentRules.read, appointmentController.read);
router
    .route("/delete/:id")
    .delete(appointmentRules.destroy, validate, appointmentController.destroy);
router
    .route("/get-by-phone/:phone")
    .get(appointmentRules.filter, filter.appointment, appointmentController.readByPhone);
router
    .route("/get-patient-by-phone/:phone")
    .get(appointmentRules.filter, filter.appointment, appointmentController.readPatientsByPhone);
router
    .route("/update-status")
    .patch(appointmentRules.updateStatus, validate, appointmentController.updateStatus);
router
    .route("/update-payment-info")
    .patch(appointmentRules.pay, appointmentController.updatePayment);
router
    .route("/upload-report/:id")
    .post(validate, appointmentController.uploadReport);
router
    .route("/delete-report/:id")
    .delete(validate, appointmentController.destroyReport);
router
    .route("/")
    .get(appointmentRules.filter, filter.appointment, validate, appointmentController.appointments)
    .patch(appointmentRules.update, validate, appointmentController.update)
    .post(appointmentRules.create, appointmentController.create);
