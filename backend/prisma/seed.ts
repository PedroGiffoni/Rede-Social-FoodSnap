import { PrismaClient } from "@prisma/client";

/*
  Este arquivo é um seed.

  Seed significa "semente".
  Ele serve para inserir dados iniciais no banco.

  No FoodSnap, vamos usar o seed para cadastrar
  categorias gastronômicas padrão, como:
  - Hamburgueria
  - Pizzaria
  - Sushi
  - Cafeteria

  Assim, quando criarmos posts ou empreendimentos,
  já teremos categorias disponíveis no banco.
*/

const prisma = new PrismaClient();

async function main() {
  /*
    Lista inicial de categorias gastronômicas.

    Essas categorias serão usadas em:
    - busca
    - filtros
    - posts
    - perfis de empreendimentos
  */
  const categories = [
    "Hamburgueria",
    "Pizzaria",
    "Churrascaria",
    "Cafeteria",
    "Doceria",
    "Padaria",
    "Açaí",
    "Comida Regional",
    "Chinesa",
    "Italiana",
    "Japonesa",
    "Mexicana",
    "Árabe",
    "Vegana",
    "Frutos do Mar",
    "Sorveteria",
    "Bar",
    "Restaurante",
    "Lanchonete",
    "Outros",
  ];

  /*
    O upsert evita duplicar categorias.

    Se a categoria já existir, ele não cria de novo.
    Se não existir, ele cria.
  */
  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: {
        name: categoryName,
      },
      update: {},
      create: {
        name: categoryName,
      },
    });
  }

  console.log("Categorias cadastradas com sucesso.");
}

/*
  Executa a função principal.

  O finally garante que a conexão com o banco será encerrada
  depois que o seed terminar.
*/
main()
  .catch((error) => {
    console.error("Erro ao cadastrar categorias:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
