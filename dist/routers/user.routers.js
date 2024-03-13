"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userRouter = express_1.default.Router();
userRouter.get("/all", verifyToken_middleware_1.verifyToken, user_controller_1.default.getAllUsers);
userRouter.get("/get-user", verifyToken_middleware_1.verifyToken, user_controller_1.default.getUserData);
exports.default = userRouter;
//# sourceMappingURL=user.routers.js.map