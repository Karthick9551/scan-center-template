import { default as express } from "express";
import * as appointmentHoursController from "../controllers/appointmentHours.js";
import { appointmentHoursRules } from "../../middlewares/validators/rules/appointmentHours.js";
import { validate } from "../../middlewares/validators/validate.js";
import filter from "../../middlewares/filters/index.js";
export const router = express.Router();
router
    .route("/get/:id")
    .get(appointmentHoursRules.read, validate, appointmentHoursController.read)
    .delete(appointmentHoursRules.destroy, validate, appointmentHoursController.destroy);
router.route("/get-time/:date").get(appointmentHoursController.getTime);
router
    .route("/")
    .get(appointmentHoursRules.filter, filter.appointmentHours, appointmentHoursController.appointmentHourses)
    .patch(appointmentHoursRules.update, validate, appointmentHoursController.update)
    .post(appointmentHoursRules.create, validate, appointmentHoursController.create);
