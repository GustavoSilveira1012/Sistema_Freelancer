"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class ActivityRepository {
    async create(data) {
        return prisma_1.default.activityLog.create({ data });
    }
    async findAllByUser(userId) {
        return prisma_1.default.activityLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
    }
}
exports.ActivityRepository = ActivityRepository;
