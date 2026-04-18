"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = require("../repositories/task.repository");
const project_repository_1 = require("../repositories/project.repository");
const taskRepo = new task_repository_1.TaskRepository();
const projectRepo = new project_repository_1.ProjectRepository();
class TaskService {
    async create(userId, data) {
        const project = await projectRepo.findById(data.projectId);
        if (!project || project.client.userId !== userId)
            throw new Error('Projeto não autorizado');
        return taskRepo.create(data);
    }
    async findAll(userId) {
        return taskRepo.findAllByUser(userId);
    }
    async update(userId, id, data) {
        const task = await taskRepo.findById(id);
        if (!task)
            throw new Error('Tarefa não encontrada');
        const project = await projectRepo.findById(task.projectId);
        if (project.client.userId !== userId)
            throw new Error('Não autorizado');
        return taskRepo.update(id, data);
    }
    async delete(userId, id) {
        const task = await taskRepo.findById(id);
        if (!task)
            throw new Error('Tarefa não encontrada');
        const project = await projectRepo.findById(task.projectId);
        if (project.client.userId !== userId)
            throw new Error('Não autorizado');
        return taskRepo.delete(id);
    }
}
exports.TaskService = TaskService;
