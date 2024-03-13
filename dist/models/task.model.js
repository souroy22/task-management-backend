"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["TODO", "IN_PROGRESS", "DONE"],
        default: "TODO",
    },
    endDate: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const Task = mongoose_1.default.model("Task", taskSchema);
exports.default = Task;
//# sourceMappingURL=task.model.js.map