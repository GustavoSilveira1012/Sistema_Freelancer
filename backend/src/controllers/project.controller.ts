import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';

const service = new ProjectService();

export class ProjectController {
  async create(req: Request, res: Response) {
    try {
      const result = await service.create(req.user!.id, req.body);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const result = await service.findAll(req.user!.id);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const result = await service.update(req.user!.id, req.params.id, req.body);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.user!.id, req.params.id);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}