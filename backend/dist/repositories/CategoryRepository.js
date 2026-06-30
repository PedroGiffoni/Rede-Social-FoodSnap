"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const prisma_1 = require("../database/prisma");
/*
  CategoryRepository

  Responsável por conversar diretamente com o banco de dados
  na tabela de categorias.

  A regra do projeto é:
  Controller não acessa banco diretamente.
  Service não acessa Prisma diretamente.
  Repository é a camada que faz isso.
*/
class CategoryRepository {
    /*
      Lista todas as categorias cadastradas no banco.
  
      A ordenação por nome facilita a exibição no frontend,
      principalmente em selects e filtros de busca.
    */
    async findAll() {
        return prisma_1.prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
        });
    }
}
exports.CategoryRepository = CategoryRepository;
