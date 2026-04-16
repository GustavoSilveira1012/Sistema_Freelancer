import { PrismaClient, Client } from '@prisma/client';

const prisma = new PrismaClient();

export class ClientRepository {
    async create(data: any): Promise<Client> {
        return prisma.client.create({ data });
    }

    async findAllByUser(userId: string): Promise<Client[]> {
        return prisma.client.findMany({
            where: { userId },
            orderBy: {name: 'asc'},
        });
    }

    async findById(id:string): Promise<Client | null> {
        return prisma.client.findUnique({ where: { id } });
    }

    async update(id: string, data: any): Promise<Client> {
    return prisma.client.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Client> {
    return prisma.client.delete({ where: { id } });
  }
}