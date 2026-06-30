"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
/*
  UserController

  Recebe as requisições HTTP relacionadas a usuários
  e chama o UserService.
*/
class UserController {
    /*
      POST /users
  
      Cria um novo usuário.
    */
    async create(req, res) {
        try {
            const { name, email, password, city, userType } = req.body;
            const userService = new UserService_1.UserService();
            const user = await userService.createUser({
                name,
                email,
                password,
                city,
                userType,
            });
            return res.status(201).json(user);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao criar usuário.",
            });
        }
    }
    /*
      GET /users/search?term=pedro
  
      Busca usuários pelo nome ou cidade.
    */
    async search(req, res) {
        try {
            const term = String(req.query.term || "");
            const userService = new UserService_1.UserService();
            const users = await userService.searchUsers(term);
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao buscar usuários.",
            });
        }
    }
    /*
      GET /users/:id
  
      Busca um usuário específico pelo ID.
      Usado no perfil público.
    */
    async show(req, res) {
        try {
            const { id } = req.params;
            const userService = new UserService_1.UserService();
            const user = await userService.getUserById(id);
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(404).json({
                message: error instanceof Error ? error.message : "Usuário não encontrado.",
            });
        }
    }
    /*
      PATCH /users/avatar
  
      Atualiza a foto de perfil do usuário logado.
  
      O frontend primeiro faz upload da imagem em /upload.
      Depois envia a URL retornada pelo Cloudinary para esta rota.
    */
    async updateAvatar(req, res) {
        try {
            const { avatarUrl } = req.body;
            const userService = new UserService_1.UserService();
            const user = await userService.updateAvatar(req.user?.id, avatarUrl);
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao atualizar foto de perfil.",
            });
        }
    }
    /*
      PATCH /users/profile
  
      Atualiza dados do perfil do usuário logado.
  
      Permite alterar:
      - nome
      - bio
      - cidade
    */
    async updateProfile(req, res) {
        try {
            const { name, bio, city } = req.body;
            const userService = new UserService_1.UserService();
            const user = await userService.updateProfile({
                userId: req.user?.id,
                name,
                bio,
                city,
            });
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao atualizar perfil.",
            });
        }
    }
}
exports.UserController = UserController;
