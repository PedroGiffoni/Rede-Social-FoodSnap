"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessController = void 0;
const BusinessService_1 = require("../services/BusinessService");
const BusinessFollowService_1 = require("../services/BusinessFollowService");
/*
  BusinessController

  Recebe requisições HTTP relacionadas a empreendimentos
  e chama o BusinessService.
*/
class BusinessController {
    /*
      POST /businesses
  
      Cria um empreendimento.
    */
    async create(req, res) {
        try {
            const { businessName, description, address, city, phone, website, openingHours, categoryId, } = req.body;
            const businessService = new BusinessService_1.BusinessService();
            const business = await businessService.createBusiness({
                userId: req.user?.id,
                businessName,
                description,
                address,
                city,
                phone,
                website,
                openingHours,
                categoryId,
                isClaimed: true,
                claimedByUserId: req.user?.id,
            });
            return res.status(201).json(business);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao criar empreendimento.",
            });
        }
    }
    /*
      GET /businesses
  
      Lista todos os empreendimentos.
    */
    async index(req, res) {
        try {
            const businessService = new BusinessService_1.BusinessService();
            const businesses = await businessService.listBusinesses();
            return res.status(200).json(businesses);
        }
        catch (error) {
            return res.status(500).json({
                message: "Erro ao listar empreendimentos.",
            });
        }
    }
    /*
      GET /businesses/search?name=burger
      GET /businesses/search?term=burger
  
      Busca empreendimentos pelo nome.
    */
    async search(req, res) {
        try {
            const name = String(req.query.name || req.query.term || "");
            const businessService = new BusinessService_1.BusinessService();
            const businesses = await businessService.searchBusinesses(name);
            return res.status(200).json(businesses);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao buscar empreendimentos.",
            });
        }
    }
    /*
      GET /businesses/:id
  
      Retorna os dados de um empreendimento específico.
    */
    async show(req, res) {
        try {
            const { id } = req.params;
            const businessService = new BusinessService_1.BusinessService();
            const business = await businessService.getBusinessById(id);
            return res.status(200).json(business);
        }
        catch (error) {
            return res.status(404).json({
                message: error instanceof Error
                    ? error.message
                    : "Empreendimento não encontrado.",
            });
        }
    }
    /*
    GET /businesses/me
  
    Retorna o restaurante do usuário logado.
  */
    async me(req, res) {
        try {
            const businessService = new BusinessService_1.BusinessService();
            const business = await businessService.getMyBusiness(req.user?.id);
            return res.status(200).json(business);
        }
        catch (error) {
            return res.status(404).json({
                message: error instanceof Error
                    ? error.message
                    : "Restaurante não encontrado.",
            });
        }
    }
    /*
    PATCH /businesses/me/images
  
    Atualiza avatar e capa do restaurante.
  */
    async updateImages(req, res) {
        try {
            const { avatarUrl, coverUrl } = req.body;
            const businessService = new BusinessService_1.BusinessService();
            const business = await businessService.updateBusinessImages(req.user?.id, {
                avatarUrl,
                coverUrl,
            });
            return res.status(200).json(business);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao atualizar imagens.",
            });
        }
    }
    /*
    PATCH /businesses/me
  
    Atualiza os dados do restaurante.
  */
    async update(req, res) {
        try {
            const { businessName, description, address, city, website, openingHours, } = req.body;
            const businessService = new BusinessService_1.BusinessService();
            const business = await businessService.updateBusiness(req.user?.id, {
                businessName,
                description,
                address,
                city,
                website,
                openingHours,
            });
            return res.status(200).json(business);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao atualizar restaurante.",
            });
        }
    }
    /*
    GET /businesses/ranking
  */
    async ranking(req, res) {
        try {
            const businessService = new BusinessService_1.BusinessService();
            const ranking = await businessService.getRanking();
            return res.status(200).json(ranking);
        }
        catch {
            return res.status(500).json({
                message: "Erro ao carregar ranking.",
            });
        }
    }
    /*
    PATCH /businesses/:id/follow
  
    Segue ou deixa de seguir restaurante.
  */
    async toggleFollow(req, res) {
        try {
            const { id } = req.params;
            const businessFollowService = new BusinessFollowService_1.BusinessFollowService();
            const result = await businessFollowService.toggleFollowBusiness(req.user?.id, id);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao seguir restaurante.",
            });
        }
    }
    /*
    GET /businesses/:id/followers-count
  
    Conta seguidores do restaurante.
  */
    async followersCount(req, res) {
        try {
            const { id } = req.params;
            const businessFollowService = new BusinessFollowService_1.BusinessFollowService();
            const result = await businessFollowService.countFollowers(id);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao contar seguidores.",
            });
        }
    }
    /*
    GET /businesses/following/me
  
    Lista restaurantes seguidos pelo usuário logado.
  */
    async myFollowedBusinesses(req, res) {
        try {
            const businessFollowService = new BusinessFollowService_1.BusinessFollowService();
            const businesses = await businessFollowService.listMyFollowedBusinesses(req.user?.id);
            return res.status(200).json(businesses);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao listar restaurantes seguidos.",
            });
        }
    }
    /*
    GET /businesses/:id/followers
  
    Lista seguidores do restaurante.
  */
    async businessFollowers(req, res) {
        try {
            const { id } = req.params;
            const businessFollowService = new BusinessFollowService_1.BusinessFollowService();
            const followers = await businessFollowService.listBusinessFollowers(id);
            return res.status(200).json(followers);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao listar seguidores.",
            });
        }
    }
    /*
    GET /businesses/:id/follow-status
  
    Verifica se o usuário logado já segue o restaurante.
  */
    async followStatus(req, res) {
        try {
            const { id } = req.params;
            const businessFollowService = new BusinessFollowService_1.BusinessFollowService();
            const result = await businessFollowService.checkIfUserFollowsBusiness(req.user?.id, id);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao verificar status de seguir.",
            });
        }
    }
}
exports.BusinessController = BusinessController;
