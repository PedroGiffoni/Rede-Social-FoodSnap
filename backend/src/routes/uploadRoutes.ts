import { Router } from "express";
import multer from "multer";
import { UploadController } from "../controllers/UploadController";
import { authMiddleware } from "../middlewares/authMiddleware";

/*
  uploadRoutes

  Rotas responsáveis pelo upload de imagens e vídeos.
*/

const uploadRoutes = Router();

const uploadController = new UploadController();

/*
  Configuração do Multer.

  storage: memoryStorage
  Significa que o arquivo ficará temporariamente em memória,
  sem ser salvo em uma pasta local.

  Isso é bom para enviar diretamente ao Cloudinary.
*/
const upload = multer({
  storage: multer.memoryStorage(),

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
uploadRoutes.post(
  "/",
  authMiddleware,
  upload.single("file"),
  uploadController.create,
);

export { uploadRoutes };
