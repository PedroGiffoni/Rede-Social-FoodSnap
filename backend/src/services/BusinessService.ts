import { BusinessRepository } from "../repositories/BusinessRepository";

/*
  BusinessService

  Camada responsável pelas regras de negócio dos empreendimentos.
*/

interface CreateBusinessRequest {
  userId?: string;
  businessName: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  categoryId?: string;
  isClaimed?: boolean;
  claimedByUserId?: string;
}

export class BusinessService {
  private businessRepository: BusinessRepository;

  constructor() {
    this.businessRepository = new BusinessRepository();
  }

  /*
    Cria um empreendimento.
  */
  async createBusiness(data: CreateBusinessRequest) {
    if (!data.businessName) {
      throw new Error("Nome do empreendimento é obrigatório.");
    }

    const businessAlreadyExists = await this.businessRepository.findExactByName(
      data.businessName,
    );

    if (businessAlreadyExists && data.isClaimed) {
      throw new Error("Já existe um empreendimento com este nome.");
    }

    return this.businessRepository.create({
      businessName: data.businessName,
      description: data.description,
      address: data.address,
      city: data.city,
      phone: data.phone,
      website: data.website,
      openingHours: data.openingHours,
      categoryId: data.categoryId,
      userId: data.userId,
      isClaimed: data.isClaimed,
      claimedByUserId: data.claimedByUserId,
    });
  }

  /*
    Lista todos os empreendimentos.
  */
  async listBusinesses() {
    return this.businessRepository.findAll();
  }

  /*
    Busca empreendimentos pelo nome.
  */
  async searchBusinesses(name: string) {
    if (!name) {
      throw new Error("Nome de busca é obrigatório.");
    }

    return this.businessRepository.findByName(name);
  }

  /*
    Busca os dados de um empreendimento específico.

    Usado na página pública do restaurante.
  */
  async getBusinessById(id: string) {
    if (!id) {
      throw new Error("ID do empreendimento é obrigatório.");
    }

    const business = await this.businessRepository.findByIdWithRelations(id);

    if (!business) {
      throw new Error("Empreendimento não encontrado.");
    }

    return business;
  }
  /*
  Retorna o restaurante pertencente
  ao usuário logado.
*/
  async getMyBusiness(userId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    const business = await this.businessRepository.findByUserId(userId);

    if (!business) {
      throw new Error("Nenhum restaurante vinculado a este usuário.");
    }

    return business;
  }

  /*
  Atualiza avatar e capa do restaurante.
*/
  async updateBusinessImages(
    userId: string,
    data: {
      avatarUrl?: string;
      coverUrl?: string;
    },
  ) {
    const business = await this.businessRepository.findByUserId(userId);

    if (!business) {
      throw new Error("Restaurante não encontrado.");
    }

    return this.businessRepository.updateImages(business.id, data);
  }

  /*
  Atualiza os dados do restaurante logado.
*/
  async updateBusiness(
    userId: string,
    data: {
      businessName?: string;
      description?: string;
      address?: string;
      city?: string;
      website?: string;
      openingHours?: string;
    },
  ) {
    const business = await this.businessRepository.findByUserId(userId);

    if (!business) {
      throw new Error("Restaurante não encontrado.");
    }

    return this.businessRepository.updateBusiness(business.id, data);
  }
  /*
  Retorna o ranking de restaurantes.
*/
  async getRanking() {
    return this.businessRepository.getRanking();
  }
}
