"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repositories/UserRepository");
class AuthService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    async login(data) {
        if (!data.email || !data.password) {
            throw new Error("Email e senha são obrigatórios.");
        }
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error("Email ou senha inválidos.");
        }
        const passwordIsValid = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!passwordIsValid) {
            throw new Error("Email ou senha inválidos.");
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            userType: user.userType,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const { passwordHash, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token,
        };
    }
}
exports.AuthService = AuthService;
