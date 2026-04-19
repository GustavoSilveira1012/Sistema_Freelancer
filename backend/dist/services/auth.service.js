"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const userRepo = new user_repository_1.UserRepository();
class AuthService {
    buildToken(user) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET não configurado no ambiente');
        }
        return jsonwebtoken_1.default.sign({
            id: user.id,
            name: user.name,
            email: user.email,
        }, secret, { expiresIn: '7d' });
    }
    async register(name, email, password) {
        const normalizedName = name?.trim();
        const normalizedEmail = email?.trim().toLowerCase();
        if (!normalizedName || !normalizedEmail || !password) {
            throw new Error('Nome, e-mail e senha são obrigatórios');
        }
        const exists = await userRepo.findByEmail(normalizedEmail);
        if (exists)
            throw new Error('Email já cadastrado');
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await userRepo.create({
            name: normalizedName,
            email: normalizedEmail,
            password: hashed,
        });
        const publicUser = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        const token = this.buildToken(publicUser);
        return { user: publicUser, token };
    }
    async login(email, password) {
        const normalizedEmail = email?.trim().toLowerCase();
        if (!normalizedEmail || !password) {
            throw new Error('Email e senha são obrigatórios');
        }
        const user = await userRepo.findByEmail(normalizedEmail);
        if (!user) {
            throw new Error('Email ou senha inválidos');
        }
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Email ou senha inválidos');
        }
        const publicUser = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        const token = this.buildToken(publicUser);
        return { user: publicUser, token };
    }
}
exports.AuthService = AuthService;
