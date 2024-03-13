"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const checkMissingFields_middleware_1 = __importDefault(require("../middlewares/checkMissingFields.middleware"));
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const authRouter = express_1.default.Router();
authRouter.post("/signup", checkMissingFields_middleware_1.default.signup, auth_controller_1.default.signup);
authRouter.post("/signin", checkMissingFields_middleware_1.default.signin, auth_controller_1.default.signin);
authRouter.get("/signout", verifyToken_middleware_1.verifyToken, auth_controller_1.default.signout);
exports.default = authRouter;
//# sourceMappingURL=auth.routers.js.map