import { v2 as cloudinary } from "cloudinary";

/*
  Configuração do Cloudinary.

  O Cloudinary será responsável por armazenar imagens e vídeos
  enviados pelos usuários do FoodSnap.

  As credenciais ficam no arquivo .env para não deixar chaves sensíveis
  expostas diretamente no código.
*/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
