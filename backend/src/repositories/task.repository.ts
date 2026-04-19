import { Task } from '@prisma/client';
import prisma from '../lib/prisma';

export class TaskRepository {
  async create(data: any): Promise<Task> {
    return prisma.task.create({ data });
  }

  async findAllByUser(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { project: { client: { userId } } },
      include: { project: { include: { client: true } } },
    });
  }

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  async update(id: string, data: any): Promise<Task> {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Task> {
    return prisma.task.delete({ where: { id } });
  }
}