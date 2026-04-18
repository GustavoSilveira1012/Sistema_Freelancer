import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';

const userRepo = new UserRepository();

type PublicUser = {
    id: string;
    name: string;
    email: string;
};

export class AuthService {
    private buildToken(user: PublicUser) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET não configurado no ambiente');
        }

        return jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            secret,
            { expiresIn: '7d' }
        );
    }

    async register(name: string, email: string, password: string) {
        const normalizedName = name?.trim();
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedName || !normalizedEmail || !password) {
            throw new Error('Nome, e-mail e senha são obrigatórios');
        }

        const exists = await userRepo.findByEmail(normalizedEmail);
        if (exists) throw new Error('Email já cadastrado');

        const hashed = await bcrypt.hash(password, 10);

        const user = await userRepo.create({
            name: normalizedName,
            email: normalizedEmail,
            password: hashed,
        });

        const publicUser: PublicUser = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        const token = this.buildToken(publicUser);

        return { user: publicUser, token };
    }

    async login(email: string, password: string) {
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            throw new Error('Email e senha são obrigatórios');
        }

        const user = await userRepo.findByEmail(normalizedEmail);
        if (!user) {
            throw new Error('Email ou senha inválidos');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Email ou senha inválidos');
        }

        const publicUser: PublicUser = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        const token = this.buildToken(publicUser);

        return { user: publicUser, token };
    }
}

    