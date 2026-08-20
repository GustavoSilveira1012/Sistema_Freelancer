"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPlan = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkPlan = (requiredPlan) => {
    return async (req, res, next) => {
        const userId = req.user.id;
        const sub = await prisma.subscription.findUnique({ where: { userId } });
        if (!sub || sub.status !== 'ACTIVE') {
            return res.status(403).json({ error: 'Assinatura necessária' });
        }
        const planOrder = { FREE: 0, PRO: 1, PREMIUM: 2 };
        const userPlan = sub.plan;
        if (!(userPlan in planOrder) || planOrder[userPlan] < planOrder[requiredPlan]) {
            return res.status(403).json({ error: `Recurso disponível apenas no plano ${requiredPlan}` });
        }
        next();
    };
};
exports.checkPlan = checkPlan;
