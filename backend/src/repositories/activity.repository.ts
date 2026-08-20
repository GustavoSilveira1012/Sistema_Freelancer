import prisma from '../lib/prisma';

type ActivityLog = {
  id: string;
  userId: string;
  action: string;
  entity: string;
  description: string;
  createdAt: Date;
};

export class ActivityRepository {
  async create(data: { userId: string; action: string; entity: string; description: string }): Promise<ActivityLog> {
    return prisma.activityLog.create({ data });
  }

  async findAllByUser(userId: string): Promise<ActivityLog[]> {
    return prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
}