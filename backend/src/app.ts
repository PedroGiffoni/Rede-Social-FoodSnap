import express from "express";
import cors from "cors";
import { businessRoutes } from "./routes/businessRoutes";
import { userRoutes } from "./routes/userRoutes";
import { authRoutes } from "./routes/authRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { categoryRoutes } from "./routes/categoryRoutes";
import { postRoutes } from "./routes/postRoutes";
import { likeRoutes } from "./routes/likeRoutes";
import { commentRoutes } from "./routes/commentRoutes";
import { searchRoutes } from "./routes/searchRoutes";
import { followRoutes } from "./routes/followRoutes";
import { rankingRoutes } from "./routes/rankingRoutes";
import { uploadRoutes } from "./routes/uploadRoutes";
import { couponRoutes } from "./routes/couponRoutes";
import { savedRoutes } from "./routes/savedRoutes";
/*
  app.ts é o arquivo principal de configuração da aplicação.

  Aqui configuramos:
  - Express
  - CORS
  - JSON
  - Rotas principais da API
*/

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rede-social-food-snap-git-v3-pedro-giffoni-s-projects.vercel.app",
    ],
    credentials: true,
  }),
);

/*
  Esta configuração permite que o Express leia requisições em JSON.
*/
app.use(express.json());

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
app.use("/users", userRoutes);

/*
  Rotas de autenticação.

  Exemplo:
  POST /auth/login
*/
app.use("/auth", authRoutes);

/*
  Rotas protegidas de teste.

  Exemplo:
  GET /protected/profile-test
*/
app.use("/protected", protectedRoutes);

/*
  Rotas de categorias.

  Exemplo:
  GET /categories
*/
app.use("/categories", categoryRoutes);
app.use("/businesses", businessRoutes);
app.use("/posts", postRoutes);
app.use("/search", searchRoutes);
app.use(likeRoutes);
app.use(commentRoutes);
app.use(followRoutes);
app.use("/ranking", rankingRoutes);
app.use("/upload", uploadRoutes);
app.use("/coupons", couponRoutes);
app.use("/saved", savedRoutes);
export default app;
