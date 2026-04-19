import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {id: string; name: string; email: string};
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({message: 'Token de autenticação ausente ou inválido'});
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user = {id: decoded.id, name: decoded.name, email: decoded.email};
        next();
    } catch {
        res.status(401).json({message: 'Token de autenticação inválido'});
        return;
    }

}