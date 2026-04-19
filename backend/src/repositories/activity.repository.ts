import { PrismaClient } from '@prisma/client';

type ActivityLog = {
  id: string;
  userId: string;
  action: string;
  entity: string;
  description: string;
  createdAt: Date;
};

const prisma = new PrismaClient();

export class ActivityRepository {
  async create(data: { userId: string; action: string; entity: string; description: string }): Promise<ActivityLog> {
    return (prisma as any).activityLog.create({ data });
  }

  async findAllByUser(userId: string): Promise<ActivityLog[]> {
    return (prisma as any).activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
}