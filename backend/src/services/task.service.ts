import { TaskRepository } from "../repositories/task.repository";
import { ProjectRepository } from "../repositories/project.repository";

const taskRepo = new TaskRepository();
const projectRepo = new ProjectRepository();

export class TaskService {
    async create(userId: string, data:any) {
        const project = await projectRepo.findById(data.projectId);
        if (!project || project.client.userId !== userId) throw new Error('Projeto não autorizado');
        return taskRepo.create(data);
    }

    async findAll(userId: string) {
        return taskRepo.findAllByUser(userId);
    }

    async update(userId:string, id:string,data:any) {
    const task = await taskRepo.findById(id);
    if (!task) throw new Error('Tarefa não encontrada');
    const project = await projectRepo.findById(task.projectId);
    if (project!.client.userId !== userId) throw new Error('Não autorizado');
    return taskRepo.update(id, data);
    }

    async delete(userId:string, id:string) {
    const task = await taskRepo.findById(id);
    if (!task) throw new Error('Tarefa não encontrada');
    const project = await projectRepo.findById(task.projectId);
    if (project!.client.userId !== userId) throw new Error('Não autorizado');
    return taskRepo.delete(id); 
    }
}