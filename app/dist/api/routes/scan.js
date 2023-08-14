import { default as express } from "express";
import * as scanController from "../controllers/scan.js";
import { scanRules } from "../../middlewares/validators/rules/scan.js";
import { validate } from "../../middlewares/validators/validate.js";
import filter from "../../middlewares/filters/index.js";
export const router = express.Router();
router
    .route("/:id")
    .get(scanRules.read, validate, scanController.read)
    .delete(scanRules.destroy, validate, scanController.destroy);
router
    .route("/")
    .get(scanRules.filter, filter.scan, scanController.scans)
    .patch(scanRules.update, validate, scanController.update)
    .post(scanRules.create, validate, scanController.create);
