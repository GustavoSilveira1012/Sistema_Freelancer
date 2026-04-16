import {PrismaClient, User} from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
    async create(data: {name: string; email: string; password: string}): Promise<User> {
        return prisma.user.create({data});
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({where: {email}});
    }
}