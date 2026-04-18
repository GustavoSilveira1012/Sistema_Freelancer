"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const client_service_1 = require("../services/client.service");
const service = new client_service_1.ClientService();
class ClientController {
    async create(req, res) {
        try {
            const result = await service.create(req.user.id, req.body);
            res.status(201).json(result);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
    async findAll(req, res) {
        try {
            const result = await service.findAll(req.user.id);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
    async update(req, res) {
        try {
            const result = await service.update(req.user.id, req.params.id, req.body);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
    async delete(req, res) {
        try {
            await service.delete(req.user.id, req.params.id);
            res.status(204).send();
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
}
exports.ClientController = ClientController;
