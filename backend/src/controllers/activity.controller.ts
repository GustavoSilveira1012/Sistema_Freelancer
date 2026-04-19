import { Request, Response } from 'express';
import { ActivityService } from '../services/activity.service';

const service = new ActivityService();

export class ActivityController {
    async findAll(req: Request, res: Response) {
        try {
            const logs = await service.findAll(req.user!.id);
            res.json(logs);
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    }
}