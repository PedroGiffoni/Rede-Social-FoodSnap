import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository";
import { BusinessRepository } from "../repositories/BusinessRepository";
import { UserType } from "../entities/User";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  city?: string;
  userType?: UserType;
}

interface UpdateProfileRequest {
  userId: string;
  name: string;
  bio?: string;
  city?: string;
}

export class UserService {
  private userRepository: UserRepository;
  private businessRepository: BusinessRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.businessRepository = new BusinessRepository();
  }

  /*
    Cadastro de usuário.
  */
  /*
  Cadastro de usuário.

  Se o tipo for BUSINESS,
  criamos automaticamente o perfil do restaurante.
*/
  async createUser(data: CreateUserRequest) {
    if (!data.name || !data.email || !data.password) {
      throw new Error("Nome, email e senha são obrigatórios.");
    }

    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error("Este email já está cadastrado.");
    }

    const passwordHash = await bcrypt.hash(data.password, 8);

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
  async searchUsers(term: string) {
    if (!term) {
      throw new Error("Termo de busca é obrigatório.");
    }

    return this.userRepository.search(term);
  }

  /*
    Busca usuário por ID para perfil público.
  */
  async getUserById(id: string) {
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
  async updateAvatar(userId: string, avatarUrl: string) {
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
  async updateProfile(data: UpdateProfileRequest) {
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
