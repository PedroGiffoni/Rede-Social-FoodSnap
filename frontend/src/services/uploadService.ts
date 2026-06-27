import { api } from "../api/api";

/*
  uploadService

  Responsável por enviar arquivos para o backend.
  O backend envia o arquivo para o Cloudinary e retorna a URL pública.
*/

export async function uploadFile(file: File) {
  const formData = new FormData();

  /*
    O nome "file" precisa ser exatamente igual ao usado no backend:
    upload.single("file")
  */
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data as {
    url: string;
    publicId: string;
    resourceType: "image" | "video";
    format: string;
  };
}
