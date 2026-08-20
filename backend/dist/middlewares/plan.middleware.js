"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPlan = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const checkPlan = (requiredPlan) => {
    return async (req, res, next) => {
        const userId = req.user.id;
        const sub = await prisma_1.default.subscription.findUnique({ where: { userId } });
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
