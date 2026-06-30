"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const authService = new AuthService_1.AuthService();
            const result = await authService.login({
                email,
                password,
            });
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(401).json({
                message: error instanceof Error ? error.message : "Erro ao fazer login.",
            });
        }
    }
}
exports.AuthController = AuthController;
