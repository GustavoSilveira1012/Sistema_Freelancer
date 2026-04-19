"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const project_repository_1 = require("../repositories/project.repository");
const client_repository_1 = require("../repositories/client.repository");
const projectRepo = new project_repository_1.ProjectRepository();
const clientRepo = new client_repository_1.ClientRepository();
class ProjectService {
    async create(userId, data) {
        const client = await clientRepo.findById(data.clientId);
        if (!client || client.userId !== userId)
            throw new Error('Cliente não autorizado');
        return projectRepo.create(data);
    }
    async findAll(userId) {
        return projectRepo.findAllByUser(userId);
    }
    async update(userId, id, data) {
        const project = await projectRepo.findById(id);
        if (!project || project.client.userId !== userId)
            throw new Error('Projeto não encontrado ou não autorizado');
        return projectRepo.update(id, data);
    }
    async delete(userId, id) {
        const project = await projectRepo.findById(id);
        if (!project || project.client.userId !== userId)
            throw new Error('Projeto não encontrado ou não autorizado');
        return projectRepo.delete(id);
    }
}
exports.ProjectService = ProjectService;
