"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const activity_repository_1 = require("../repositories/activity.repository");
const repo = new activity_repository_1.ActivityRepository();
class ActivityService {
    async create(userId, action, entity, description) {
        return repo.create({ userId, action, entity, description });
    }
    async findAll(userId) {
        return repo.findAllByUser(userId);
    }
}
exports.ActivityService = ActivityService;
