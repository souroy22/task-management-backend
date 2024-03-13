"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routers_1 = __importDefault(require("./auth.routers"));
const task_routers_1 = __importDefault(require("./task.routers"));
const user_routers_1 = __importDefault(require("./user.routers"));
const router = express_1.default.Router();
router.use("/auth", auth_routers_1.default);
router.use("/task", task_routers_1.default);
router.use("/user", user_routers_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map