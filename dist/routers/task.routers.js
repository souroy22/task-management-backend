"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = __importDefault(require("../controllers/task.controller"));
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const checkMissingFields_middleware_1 = __importDefault(require("../middlewares/checkMissingFields.middleware"));
const taskRouter = express_1.default.Router();
taskRouter.post("/create", verifyToken_middleware_1.verifyToken, checkMissingFields_middleware_1.default.createTask, task_controller_1.default.createTask);
taskRouter.get("/all", verifyToken_middleware_1.verifyToken, task_controller_1.default.getAllTasks);
taskRouter.get("/my-tasks", verifyToken_middleware_1.verifyToken, task_controller_1.default.getMyTasks);
taskRouter.patch("/update/:slug", verifyToken_middleware_1.verifyToken, task_controller_1.default.updateTask);
taskRouter.delete("/delete/:slug", verifyToken_middleware_1.verifyToken, task_controller_1.default.deleteTask);
exports.default = taskRouter;
//# sourceMappingURL=task.routers.js.map