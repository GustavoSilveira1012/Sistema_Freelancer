"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const activity_service_1 = require("../services/activity.service");
const service = new activity_service_1.ActivityService();
class ActivityController {
    async findAll(req, res) {
        try {
            const logs = await service.findAll(req.user.id);
            res.json(logs);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
}
exports.ActivityController = ActivityController;
