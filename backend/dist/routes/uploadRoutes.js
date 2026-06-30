"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const UploadController_1 = require("../controllers/UploadController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  uploadRoutes

  Rotas responsáveis pelo upload de imagens e vídeos.
*/
const uploadRoutes = (0, express_1.Router)();
exports.uploadRoutes = uploadRoutes;
const uploadController = new UploadController_1.UploadController();
/*
  Configuração do Multer.

  storage: memoryStorage
  Significa que o arquivo ficará temporariamente em memória,
  sem ser salvo em uma pasta local.

  Isso é bom para enviar diretamente ao Cloudinary.
*/
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    /*
      Limite de tamanho do arquivo.
  
      Aqui usamos 50 MB para permitir imagens e vídeos curtos.
      Depois podemos ajustar conforme necessidade do projeto.
    */
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});
/*
  POST /upload

  Rota protegida.
  Somente usuário logado pode fazer upload.

  O campo do arquivo no Thunder Client deve se chamar:

  file
*/
uploadRoutes.post("/", authMiddleware_1.authMiddleware, upload.single("file"), uploadController.create);
