import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";

interface LoginRequest {
  email: string;
  password: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: LoginRequest) {
    if (!data.email || !data.password) {
      throw new Error("Email e senha são obrigatórios.");
    }

    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Email ou senha inválidos.");
    }

    const passwordIsValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new Error("Email ou senha inválidos.");
    }

    const token = jwt.sign(
      {
        id: user.id,
        userType: user.userType,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      },
    );

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
