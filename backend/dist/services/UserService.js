"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserRepository_1 = require("../repositories/UserRepository");
const BusinessRepository_1 = require("../repositories/BusinessRepository");
class UserService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
        this.businessRepository = new BusinessRepository_1.BusinessRepository();
    }
    /*
      Cadastro de usuário.
    */
    /*
    Cadastro de usuário.
  
    Se o tipo for BUSINESS,
    criamos automaticamente o perfil do restaurante.
  */
    async createUser(data) {
        if (!data.name || !data.email || !data.password) {
            throw new Error("Nome, email e senha são obrigatórios.");
        }
        const userAlreadyExists = await this.userRepository.findByEmail(data.email);
        if (userAlreadyExists) {
            throw new Error("Este email já está cadastrado.");
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 8);
        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            passwordHash,
            city: data.city,
            userType: data.userType,
        });
        /*
        Se for conta empresarial,
        criamos automaticamente o restaurante.
      */
        if (user.userType === "BUSINESS") {
            await this.businessRepository.create({
                businessName: user.name,
                city: user.city ?? undefined,
                userId: user.id,
                isClaimed: true,
                claimedByUserId: user.id,
            });
        }
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    /*
      Busca utilizada pela aba Explorar.
    */
    async searchUsers(term) {
        if (!term) {
            throw new Error("Termo de busca é obrigatório.");
        }
        return this.userRepository.search(term);
    }
    /*
      Busca usuário por ID para perfil público.
    */
    async getUserById(id) {
        if (!id) {
            throw new Error("ID do usuário é obrigatório.");
        }
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    /*
      Atualiza a foto de perfil do usuário logado.
    */
    async updateAvatar(userId, avatarUrl) {
        if (!userId) {
            throw new Error("Usuário não autenticado.");
        }
        if (!avatarUrl) {
            throw new Error("URL da imagem é obrigatória.");
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        return this.userRepository.updateAvatar(userId, avatarUrl);
    }
    /*
      Atualiza os dados principais do perfil.
  
      Permite alterar:
      - nome
      - bio
      - cidade
    */
    async updateProfile(data) {
        if (!data.userId) {
            throw new Error("Usuário não autenticado.");
        }
        if (!data.name || data.name.trim().length === 0) {
            throw new Error("Nome é obrigatório.");
        }
        const user = await this.userRepository.findById(data.userId);
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        return this.userRepository.updateProfile(data.userId, {
            name: data.name.trim(),
            bio: data.bio?.trim(),
            city: data.city?.trim(),
        });
    }
}
exports.UserService = UserService;
