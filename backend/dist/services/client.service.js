"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const client_repository_1 = require("../repositories/client.repository");
const repo = new client_repository_1.ClientRepository();
class ClientService {
    async create(userId, data) {
        return repo.create({ ...data, userId });
    }
    async findAll(userId) {
        return repo.findAllByUser(userId);
    }
    async update(userId, id, data) {
        const client = await repo.findById(id);
        if (!client || client.userId !== userId)
            throw new Error('Cliente não encontrado ou não autorizado');
        return repo.update(id, data);
    }
    async delete(userId, id) {
        const client = await repo.findById(id);
        if (!client || client.userId !== userId)
            throw new Error('Cliente não encontrado ou não autorizado');
        return repo.delete(id);
    }
}
exports.ClientService = ClientService;
