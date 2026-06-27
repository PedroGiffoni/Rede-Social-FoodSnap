import "dotenv/config";
import app from "./app";
import { notificationRoutes } from "./routes/notificationRoutes";
const PORT = process.env.PORT || 3333;

app.use("/notifications", notificationRoutes);

app.listen(PORT, () => {
  console.log(`Servidor FoodSnap rodando na porta ${PORT}`);
});
