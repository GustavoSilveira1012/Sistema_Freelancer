"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ActivityRepository {
    async create(data) {
        return prisma.activityLog.create({ data });
    }
    async findAllByUser(userId) {
        return prisma.activityLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
    }
}
exports.ActivityRepository = ActivityRepository;
