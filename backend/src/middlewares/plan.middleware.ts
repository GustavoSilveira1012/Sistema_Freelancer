import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkPlan = (requiredPlan: 'PRO' | 'PREMIUM') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    const sub = await (prisma as any).subscription.findUnique({ where: { userId } });

    if (!sub || sub.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Assinatura necessária' });
    }

    const planOrder: Record<'FREE' | 'PRO' | 'PREMIUM', number> = { FREE: 0, PRO: 1, PREMIUM: 2 };
    const userPlan = sub.plan as keyof typeof planOrder;

    if (!(userPlan in planOrder) || planOrder[userPlan] < planOrder[requiredPlan]) {
      return res.status(403).json({ error: `Recurso disponível apenas no plano ${requiredPlan}` });
    }

    next();
  };
};