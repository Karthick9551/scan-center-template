import db from "../../models/index.js";
const { User } = db;
async function users(req, res, next) {
    try {
        const { filter, pagination } = res.locals;
        const { count, rows } = await User.findAndCountAll({
            attributes: [
                "id",
                "name",
                "userName",
                "role",
                "phone",
                "email",
                "address",
                "createdBy",
                "updatedBy",
                "createdAt",
                "updatedAt",
            ],
            ...filter,
        });
        if (count) {
            pagination.count = count;
            return res.status(200).json({ users: rows, pagination });
        }
        else {
            return res.status(400).json({
                error: "No users found",
            });
        }
    }
    catch (error) {
        console.log("\n\nError getting users:", error, "\n\n");
        next({ status: 500, error: "Db error getting users" });
    }
}
async function create(req, res, next) {
    try {
        const { name, userName, password, role, phone, email, address } = req.body;
        const reqUser = req.headers["user-id"]
            ? req.headers["user-id"].toString()
            : "";
        const user = await User.create({
            name,
            userName,
            password,
            role,
            phone,
            email,
            address,
            createdBy: reqUser,
            updatedBy: reqUser,
        });
        if (user.dataValues) {
            return res.status(201).json({ user });
        }
        else {
            return res.status(400).json({
                error: "User not created. Please try again",
            });
        }
    }
    catch (error) {
        console.log("\n\nError creating user: ", error, "\n\n");
        next({ status: 500, error: "Db error creating user" });
    }
}
async function read(req, res, next) {
    try {
        const user = await User.findByPk(req.params.id);
        if (user === null) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        else {
            user.password = "";
            return res.status(200).json({ user });
        }
    }
    catch (error) {
        console.log("\n\nError getting user: ", error, "\n\n");
        next({ status: 500, error: "Db error getting user" });
    }
}
async function readProfile(req, res, next) {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ["id", "name", "userName", "phone", "email", "address"],
        });
        if (user === null) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        else {
            return res.status(200).json({ user });
        }
    }
    catch (error) {
        console.log("\n\nError getting user: ", error, "\n\n");
        next({ status: 500, error: "Db error getting user" });
    }
}
async function update(req, res, next) {
    try {
        const { id, name, userName, password, role, phone, email, address } = req.body;
        const reqUser = req.headers["user-id"]
            ? req.headers["user-id"].toString()
            : "";
        const [affectedRows] = await User.update({
            name,
            userName,
            password,
            role,
            phone,
            email,
            address,
            updatedBy: reqUser,
        }, { where: { id } });
        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "User not updated. Please try again",
            });
        }
        else {
            const user = await User.findByPk(id);
            return res.status(200).json({ user });
        }
    }
    catch (error) {
        console.log("\n\nError updating user: ", error, "\n\n");
        next({ status: 500, error: "Db error updating user" });
    }
}
async function updateProfile(req, res, next) {
    try {
        const { id, name, userName, phone, email, address } = req.body;
        const reqUser = req.headers["user-id"]
            ? req.headers["user-id"].toString()
            : "";
        const [affectedRows] = await User.update({
            name,
            userName,
            phone,
            email,
            address,
            updatedBy: reqUser,
        }, { where: { id } });
        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "Profile not updated. Please try again",
            });
        }
        else {
            return res.status(200).json({ isUpdated: true });
        }
    }
    catch (error) {
        console.log("\n\nError updating profile: ", error, "\n\n");
        next({ status: 500, error: "Db error updating profile" });
    }
}
async function changePassword(req, res, next) {
    try {
        const { id, oldPassword, password } = req.body;
        const reqUser = req.headers["user-id"]
            ? req.headers["user-id"].toString()
            : "";
        const user = await User.findByPk(id);
        if (user === null) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        else {
            if (user.password === oldPassword) {
                const [affectedRows] = await User.update({
                    password,
                    updatedBy: reqUser,
                }, { where: { id } });
                if (affectedRows !== 1) {
                    return res.status(400).json({
                        error: "Password not changed. Please try again",
                    });
                }
                else {
                    return res.status(200).json({ isChanged: true });
                }
            }
            else {
                return res.status(400).json({
                    error: "Current Password is wrong. Please enter the correct password.",
                });
            }
        }
    }
    catch (error) {
        console.log("\n\nError changing password: ", error, "\n\n");
        next({ status: 500, error: "Db error changing password" });
    }
}
async function destroy(req, res, next) {
    try {
        const { id } = req.params;
        const affectedRows = await User.destroy({ where: { id } });
        if (affectedRows !== id.length) {
            const notDeleted = id.length - affectedRows;
            return res.status(400).json({
                error: `${notDeleted > 1 ? `${notDeleted} Users` : "User"} not deleted. Please try again`,
            });
        }
        else {
            return res.status(200).json({
                message: `${id.length > 1 ? `${id.length} Users` : "User"} deleted successfully`,
            });
        }
    }
    catch (error) {
        console.log("\n\nError deleting user ", error, "\n\n");
        next({ status: 500, error: "Db error deleting user" });
    }
}
export { users, create, read, readProfile, update, updateProfile, changePassword, destroy, };
