"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const slugify_1 = __importDefault(require("slugify"));
const task_model_1 = __importDefault(require("../models/task.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const uid = new short_unique_id_1.default({ length: 4 });
const taskControllers = {
    createTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, description, startDate, endDate, userEmail, status = "TODO", } = req.body;
            let slug = (0, slugify_1.default)(name, { lower: true });
            const existingTask = yield task_model_1.default.findOne({ slug });
            if (existingTask) {
                slug = slug + "-" + uid.rnd();
            }
            const assignedUser = yield user_model_1.default.findOne({ email: userEmail });
            if (!assignedUser) {
                return res.status(404).json({
                    error: "No such user found",
                });
            }
            const newTask = new task_model_1.default({
                name,
                description,
                startDate,
                endDate,
                status,
                slug,
                assignedUser: assignedUser._id,
                createdBy: req.user.user.id,
            });
            yield newTask.save();
            // await User.findByIdAndUpdate(
            //   assignedUser._id,
            //   {
            //     $push: { assignedTasks: newTask._id },
            //   },
            //   { new: true }
            // );
            const task = {
                name,
                description,
                startDate,
                endDate,
                status,
                slug,
                assignedUser: { name: assignedUser.name, email: assignedUser.email },
            };
            return res.status(200).json(task);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getAllTasks: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { limit = 10, page = 1, status } = req.query;
            const filters = {};
            if (status) {
                filters["status"] = String(status);
            }
            limit = Math.abs(Number(limit));
            let pageCount = (Math.abs(Number(page)) || 1) - 1;
            const totalCount = yield task_model_1.default.countDocuments(filters);
            const tasks = yield task_model_1.default.find(filters)
                .limit(limit)
                .skip(limit * pageCount)
                .select({
                name: 1,
                description: 1,
                startDate: 1,
                slug: 1,
                status: 1,
                endDate: 1,
                createdBy: 1,
                assignedUser: 1,
                _id: 0,
            })
                .populate([
                { path: "createdBy", select: "name -_id" },
                { path: "assignedUser", select: "name email -_id" },
            ])
                .sort({ updatedAt: -1 });
            const tasksWithoutIds = tasks.map((task) => {
                const taskObject = task.toObject();
                if ("_id" in taskObject) {
                    delete taskObject._id;
                }
                return taskObject;
            });
            return res.status(200).json({ tasks: tasksWithoutIds, totalCount });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getMyTasks: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { limit = 10, page = 1, status } = req.query;
            limit = Math.abs(Number(limit));
            let pageCount = (Math.abs(Number(page)) || 1) - 1;
            const totalCount = yield task_model_1.default.countDocuments({
                assignedUser: req.user.user.id,
            });
            const tasks = yield task_model_1.default.find({ assignedUser: req.user.user.id })
                .select({
                name: 1,
                description: 1,
                startDate: 1,
                endDate: 1,
                status: 1,
                slug: 1,
                assignedUser: 1,
                createdBy: 1,
                assignedTasks: 1,
                _id: 0,
            })
                .populate([
                { path: "assignedUser", select: "name email -_id" },
                { path: "createdBy", select: "name -_id" },
            ])
                .sort({ updatedAt: -1 });
            return res.status(200).json({ tasks: tasks, totalCount });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    updateTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const slug = req.params.slug;
        const requestBody = req.body;
        if (req.body.userEmail) {
            const user = yield user_model_1.default.findOne({ email: req.body.userEmail });
            if (!user) {
                return res
                    .status(404)
                    .json({ message: "No such assigned user found!" });
            }
            requestBody["assignedUser"] = user._id;
        }
        try {
            const task = yield task_model_1.default.findOne({ slug });
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            const validFields = Object.keys(requestBody).filter((key) => key in task && key !== "_id" && key !== "__v");
            validFields.forEach((key) => {
                task[key] = requestBody[key];
            });
            yield task.save();
            const updatedTask = task.toObject();
            delete updatedTask._id;
            return res.status(200).json(updatedTask);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    deleteTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const slug = req.params.slug;
        try {
            const deletedTask = yield task_model_1.default.findOneAndDelete({ slug });
            yield user_model_1.default.findByIdAndUpdate(deletedTask === null || deletedTask === void 0 ? void 0 : deletedTask.assignedUser, {
                $pop: { assignedTasks: deletedTask === null || deletedTask === void 0 ? void 0 : deletedTask._id },
            });
            return res.status(200).json({ message: "Task deleted successfully" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = taskControllers;
//# sourceMappingURL=task.controller.js.map