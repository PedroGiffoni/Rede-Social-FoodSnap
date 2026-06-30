"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
/*
  Configuração do Cloudinary.

  O Cloudinary será responsável por armazenar imagens e vídeos
  enviados pelos usuários do FoodSnap.

  As credenciais ficam no arquivo .env para não deixar chaves sensíveis
  expostas diretamente no código.
*/
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
