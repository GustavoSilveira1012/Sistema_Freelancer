"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class ClientRepository {
    async create(data) {
        return prisma_1.default.client.create({ data });
    }
    async findAllByUser(userId) {
        return prisma_1.default.client.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        });
    }
    async findById(id) {
        return prisma_1.default.client.findUnique({ where: { id } });
    }
    async update(id, data) {
        return prisma_1.default.client.update({ where: { id }, data });
    }
    async delete(id) {
        return prisma_1.default.client.delete({ where: { id } });
    }
}
exports.ClientRepository = ClientRepository;
