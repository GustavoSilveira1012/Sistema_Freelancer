import { PrismaClient, Project } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectRepository {
    async create(data: any): Promise<Project> {
        return prisma.project.create({ data });
    }

    async findAllByUser(userId: string): Promise<Project[]> {
    return prisma.project.findMany({
      where: { client: { userId } },
      include: { client: true, tasks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
      include: { client: true, tasks: true },
    });
  }

  async update(id: string, data: any): Promise<Project> {
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({ where: { id } });
  }
}