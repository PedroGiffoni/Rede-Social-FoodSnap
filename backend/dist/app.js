"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const businessRoutes_1 = require("./routes/businessRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const protectedRoutes_1 = require("./routes/protectedRoutes");
const categoryRoutes_1 = require("./routes/categoryRoutes");
const postRoutes_1 = require("./routes/postRoutes");
const likeRoutes_1 = require("./routes/likeRoutes");
const commentRoutes_1 = require("./routes/commentRoutes");
const searchRoutes_1 = require("./routes/searchRoutes");
const followRoutes_1 = require("./routes/followRoutes");
const rankingRoutes_1 = require("./routes/rankingRoutes");
const uploadRoutes_1 = require("./routes/uploadRoutes");
const couponRoutes_1 = require("./routes/couponRoutes");
const savedRoutes_1 = require("./routes/savedRoutes");
/*
  app.ts é o arquivo principal de configuração da aplicação.

  Aqui configuramos:
  - Express
  - CORS
  - JSON
  - Rotas principais da API
*/
const app = (0, express_1.default)();
/*
  CORS permite que o frontend em Vue.js consiga consumir esta API.
*/
app.use((0, cors_1.default)());
/*
  Esta configuração permite que o Express leia requisições em JSON.
*/
app.use(express_1.default.json());
/*
  Rota inicial apenas para verificar se a API está funcionando.
*/
app.get("/", (req, res) => {
    return res.json({
        message: "FoodSnap API funcionando!",
    });
});
/*
  Rotas de usuários.

  Exemplo:
  POST /users
*/
app.use("/users", userRoutes_1.userRoutes);
/*
  Rotas de autenticação.

  Exemplo:
  POST /auth/login
*/
app.use("/auth", authRoutes_1.authRoutes);
/*
  Rotas protegidas de teste.

  Exemplo:
  GET /protected/profile-test
*/
app.use("/protected", protectedRoutes_1.protectedRoutes);
/*
  Rotas de categorias.

  Exemplo:
  GET /categories
*/
app.use("/categories", categoryRoutes_1.categoryRoutes);
app.use("/businesses", businessRoutes_1.businessRoutes);
app.use("/posts", postRoutes_1.postRoutes);
app.use("/search", searchRoutes_1.searchRoutes);
app.use(likeRoutes_1.likeRoutes);
app.use(commentRoutes_1.commentRoutes);
app.use(followRoutes_1.followRoutes);
app.use("/ranking", rankingRoutes_1.rankingRoutes);
app.use("/upload", uploadRoutes_1.uploadRoutes);
app.use("/coupons", couponRoutes_1.couponRoutes);
app.use("/saved", savedRoutes_1.savedRoutes);
exports.default = app;
