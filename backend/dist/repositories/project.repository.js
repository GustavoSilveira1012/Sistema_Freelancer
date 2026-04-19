"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class ProjectRepository {
    async create(data) {
        return prisma_1.default.project.create({ data });
    }
    async findAllByUser(userId) {
        return prisma_1.default.project.findMany({
            where: { client: { userId } },
            include: { client: true, tasks: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return prisma_1.default.project.findUnique({
            where: { id },
            include: { client: true, tasks: true },
        });
    }
    async update(id, data) {
        return prisma_1.default.project.update({ where: { id }, data });
    }
    async delete(id) {
        return prisma_1.default.project.delete({ where: { id } });
    }
}
exports.ProjectRepository = ProjectRepository;
