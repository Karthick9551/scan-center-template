import db from "../../models/index.js";
const { Scan } = db;
async function scans(req, res, next) {
    try {
        const { filter, pagination } = res.locals;
        const { count, rows } = await Scan.findAndCountAll({ ...filter });
        if (count) {
            pagination.count = count;
            return res.status(200).json({ scans: rows, pagination });
        }
        else {
            return res.status(400).json({
                error: "No scans found",
            });
        }
    }
    catch (error) {
        console.log("\n\nError getting scans:", error, "\n\n");
        next({ status: 500, error: "Db error getting scans" });
    }
}
async function create(req, res, next) {
    try {
        const { name, amount, description } = req.body;
        const reqUser = req.headers["user-id"]
            ? req.headers["user-id"].toString()
            : "";
        const scan = await Scan.create({
            name,
            amount,
            description,
            isActive: true,
            createdBy: reqUser,
            updatedBy: reqUser,
        });
        if (scan.dataValues) {
            return res.status(201).json({ scan });
        }
        else {
            return res.status(400).json({
                error: "Scan not created. Please try again",
            });
        }
    }
    catch (error) {
        console.log("\n\nError creating scan: ", error, "\n\n");
        next({ status: 500, error: "Db error creating scan" });
    }
}
async function read(req, res, next) {
    try {
        const scan = await Scan.findByPk(req.params.id);
        if (scan === null) {
            return res.status(400).json({
                error: "Scan not found",
            });
        }
        else {
            return res.status(200).json({ scan });
        }
    }
    catch (error) {
        console.log("\n\nError getting scan: ", error, "\n\n");
        next({ status: 500, error: "Db error getting scan" });
    }
}
async function update(req, res, next) {
    try {
        const { id, name, amount, description, isActive } = req.body;
        const reqUser = req.headers["user-id"]
            ? req.headers["user-id"].toString()
            : "";
        const [affectedRows] = await Scan.update({ name, amount, description, isActive, updatedBy: reqUser }, { where: { id } });
        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "Scan not updated. Please try again",
            });
        }
        else {
            const scan = await Scan.findByPk(id);
            return res.status(200).json({ scan });
        }
    }
    catch (error) {
        console.log("\n\nError updating scan: ", error, "\n\n");
        next({ status: 500, error: "Db error updating scan" });
    }
}
async function destroy(req, res, next) {
    try {
        const { id } = req.params;
        const affectedRows = await Scan.destroy({ where: { id } });
        if (affectedRows !== id.length) {
            const notDeleted = id.length - affectedRows;
            return res.status(400).json({
                error: `${notDeleted > 1 ? `${notDeleted} scans` : "Scan"} not deleted. Please try again`,
            });
        }
        else {
            return res.status(200).json({
                message: `${id.length > 1 ? `${id.length} scans` : "Scan"} deleted successfully`,
            });
        }
    }
    catch (error) {
        console.log("\n\nError deleting scan ", error, "\n\n");
        next({ status: 500, error: "Db error deleting scan" });
    }
}
export { scans, create, read, update, destroy };
