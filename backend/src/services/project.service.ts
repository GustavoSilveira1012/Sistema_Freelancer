import { ProjectRepository } from "../repositories/project.repository";
import { ClientRepository } from "../repositories/client.repository";

const projectRepo = new ProjectRepository();
const clientRepo = new ClientRepository();

export class ProjectService {
    async create(userId: string, data:any) {
        const client = await clientRepo.findById(data.clientId);
        if (!client || client.userId !== userId) throw new Error('Cliente não autorizado');
        return projectRepo.create(data);
    }

    async findAll(userId: string) {
        return projectRepo.findAllByUser(userId);
    }

    async update(userId:string, id:string,data:any) {
        const project = await projectRepo.findById(id);
        if (!project || project.client.userId !== userId) throw new Error('Projeto não encontrado ou não autorizado');
        return projectRepo.update(id, data);
    }

    async delete(userId: string, id: string) {
        const project = await projectRepo.findById(id);
        if (!project || project.client.userId !== userId) throw new Error('Projeto não encontrado ou não autorizado');
        return projectRepo.delete(id);
    }
}
