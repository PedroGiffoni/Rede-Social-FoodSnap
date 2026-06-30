"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../database/prisma");
/*
  UserRepository

  Responsável por conversar diretamente com a tabela users no banco.
*/
class UserRepository {
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
        });
    }
    /*
      Busca usuários para a aba Buscar.
  
      Procura usuários pelo nome ou pela cidade.
    */
    async search(term) {
        return prisma_1.prisma.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: term,
                            mode: "insensitive",
                        },
                    },
                    {
                        city: {
                            contains: term,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                city: true,
                avatarUrl: true,
                userType: true,
                bio: true,
            },
            take: 20,
        });
    }
    async create(data) {
        return prisma_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                city: data.city,
                userType: data.userType || "COMMON",
            },
        });
    }
    /*
      Atualiza a foto do usuário.
    */
    async updateAvatar(userId, avatarUrl) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                avatarUrl,
            },
        });
    }
    /*
      Atualiza nome, bio e cidade do usuário.
    */
    async updateProfile(userId, data) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: data.name,
                bio: data.bio,
                city: data.city,
            },
            select: {
                id: true,
                name: true,
                email: true,
                city: true,
                bio: true,
                avatarUrl: true,
                userType: true,
            },
        });
    }
}
exports.UserRepository = UserRepository;
