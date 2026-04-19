import { ActivityRepository } from "../repositories/activity.repository";

const repo = new ActivityRepository();

export class ActivityService {
    async create(userId: string, action: string, entity: string, description: string) {
        return repo.create({userId, action, entity, description});
    }

    async findAll(userId: string) {
        return repo.findAllByUser(userId);
    }
}