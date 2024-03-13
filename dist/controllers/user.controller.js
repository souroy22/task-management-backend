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
const user_model_1 = __importDefault(require("../models/user.model"));
const getUser_util_1 = __importDefault(require("../utils/getUser.util"));
const userControllers = {
    getAllUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { limit = 10, page = 1, searchVal } = req.query;
            let filter = {};
            if (searchVal && String(searchVal).trim()) {
                filter = {
                    $or: [
                        { name: { $regex: searchVal, $options: "i" } }, // Case-insensitive match for name
                        { email: { $regex: searchVal, $options: "i" } }, // Case-insensitive match for email
                    ],
                };
            }
            limit = Math.abs(Number(limit));
            let pageCount = (Math.abs(Number(page)) || 1) - 1;
            const totalCount = yield user_model_1.default.countDocuments();
            const users = yield user_model_1.default.find(filter)
                // .limit(limit)
                // .skip(limit * pageCount)
                .select({ name: 1, email: 1, _id: 0 });
            return res.status(200).json({ users, totalCount });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isExist = yield (0, getUser_util_1.default)(req.user.user.email);
            if (!isExist) {
                return res.status(404).json({ error: "No such user found!" });
            }
            const user = {
                name: isExist.name,
                email: isExist.email,
                avatar: isExist.avatar || null,
            };
            return res.status(200).json({ user });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
};
exports.default = userControllers;
//# sourceMappingURL=user.controller.js.map