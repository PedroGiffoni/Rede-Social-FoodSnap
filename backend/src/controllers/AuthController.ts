import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const authService = new AuthService();

      const result = await authService.login({
        email,
        password,
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({
        message:
          error instanceof Error ? error.message : "Erro ao fazer login.",
      });
    }
  }
}
