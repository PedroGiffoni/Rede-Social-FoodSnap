"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  Este arquivo cria rotas protegidas.

  Rotas protegidas são rotas que só podem ser acessadas
  por usuários autenticados, ou seja, usuários que fizeram login
  e possuem um token JWT válido.

  Neste momento, essa rota é apenas para teste.
  Depois usaremos o mesmo middleware em posts, comentários,
  curtidas e seguidores.
*/
const protectedRoutes = (0, express_1.Router)();
exports.protectedRoutes = protectedRoutes;
/*
  GET /protected/profile-test

  Esta rota usa o authMiddleware antes de responder.

  Fluxo:
  1. O usuário envia o token no Thunder Client.
  2. O authMiddleware verifica se o token é válido.
  3. Se for válido, ele libera o acesso.
  4. Se não for válido, retorna erro 401.
*/
protectedRoutes.get("/profile-test", authMiddleware_1.authMiddleware, (req, res) => {
    return res.json({
        message: "Você acessou uma rota protegida com sucesso.",
        user: req.user,
    });
});
