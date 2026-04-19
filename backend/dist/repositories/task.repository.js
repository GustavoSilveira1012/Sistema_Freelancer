"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class TaskRepository {
    async create(data) {
        return prisma_1.default.task.create({ data });
    }
    async findAllByUser(userId) {
        return prisma_1.default.task.findMany({
            where: { project: { client: { userId } } },
            include: { project: { include: { client: true } } },
        });
    }
    async findById(id) {
        return prisma_1.default.task.findUnique({ where: { id } });
    }
    async update(id, data) {
        return prisma_1.default.task.update({ where: { id }, data });
    }
    async delete(id) {
        return prisma_1.default.task.delete({ where: { id } });
    }
}
exports.TaskRepository = TaskRepository;
