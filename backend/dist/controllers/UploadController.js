"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const cloudinary_1 = require("../config/cloudinary");
/*
  UploadController

  Responsável por receber arquivos enviados pelo usuário
  e mandar esses arquivos para o Cloudinary.

  Neste primeiro momento, ele apenas:
  - recebe uma imagem ou vídeo
  - envia para o Cloudinary
  - devolve a URL pública do arquivo

  Depois essa URL será usada no campo mediaUrl das postagens.
*/
class UploadController {
    /*
      POST /upload
  
      Recebe um arquivo enviado pelo Thunder Client, Postman ou frontend.
  
      O arquivo chega em req.file por causa do Multer.
    */
    async create(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Nenhum arquivo enviado.",
                });
            }
            /*
              O Multer salva o arquivo temporariamente em memória.
              Como estamos usando buffer, precisamos converter para base64
              antes de enviar ao Cloudinary.
            */
            const fileBase64 = req.file.buffer.toString("base64");
            /*
              Montamos um Data URI.
      
              Exemplo:
              data:image/png;base64,AAA...
      
              Isso permite enviar o arquivo diretamente ao Cloudinary
              sem precisar salvar no disco do computador.
            */
            const fileDataUri = `data:${req.file.mimetype};base64,${fileBase64}`;
            /*
              Envia o arquivo ao Cloudinary.
      
              resource_type: "auto" permite aceitar imagem e vídeo.
              folder organiza os arquivos dentro da pasta foodsnap.
            */
            const uploadedFile = await cloudinary_1.cloudinary.uploader.upload(fileDataUri, {
                folder: "foodsnap",
                resource_type: "auto",
            });
            return res.status(201).json({
                url: uploadedFile.secure_url,
                publicId: uploadedFile.public_id,
                resourceType: uploadedFile.resource_type,
                format: uploadedFile.format,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Erro ao fazer upload para o Cloudinary.",
            });
        }
    }
}
exports.UploadController = UploadController;
