import { ClientRepository } from "../repositories/client.repository";

const repo = new ClientRepository();

export class ClientService {
    async create(userId:string, data: any) {
        return repo.create({...data, userId});
    }

    async findAll(userId: string) {
        return repo.findAllByUser(userId);
    }

    async update(userId: string, id: string, data: any) {
        const client = await repo.findById(id);
        if (!client || client.userId !== userId) throw new Error('Cliente não encontrado ou não autorizado');
        return repo.update(id, data);
    }

    async delete(userId: string, id: string) {
        const client = await repo.findById(id);
        if (!client || client.userId !== userId) throw new Error('Cliente não encontrado ou não autorizado');
        return repo.delete(id);
    }
}