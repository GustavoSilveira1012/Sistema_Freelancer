"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const result = await authService.register(req.body.name, req.body.email, req.body.password);
            res.status(201).json(result);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
    async login(req, res) {
        try {
            const result = await authService.login(req.body.email, req.body.password);
            res.json(result);
        }
        catch (e) {
            res.status(401).json({ error: e.message });
        }
    }
    async me(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        res.json(req.user);
    }
}
exports.AuthController = AuthController;
