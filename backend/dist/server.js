"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const notificationRoutes_1 = require("./routes/notificationRoutes");
const PORT = process.env.PORT || 3333;
app_1.default.use("/notifications", notificationRoutes_1.notificationRoutes);
app_1.default.listen(PORT, () => {
    console.log(`Servidor FoodSnap rodando na porta ${PORT}`);
});
