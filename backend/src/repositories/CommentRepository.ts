import { prisma } from "../database/prisma";

/*
  CommentRepository

  Camada responsável por acessar diretamente a tabela de comentários.

  Aqui fazemos apenas operações de banco:
  - criar comentário
  - listar comentários de uma postagem

  Regras de negócio ficam no CommentService.
*/

interface CreateCommentData {
  postId: string;
  userId: string;
  content: string;
}

export class CommentRepository {
  /*
    Cria um novo comentário em uma postagem.

    Importante:
    Já retornamos junto os dados do usuário que comentou.
    Assim o frontend consegue mostrar o nome e a foto do autor do comentário.
  */
  async create(data: CreateCommentData) {
    return prisma.comment.create({
      data: {
        postId: data.postId,
        userId: data.userId,
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            userType: true,
          },
        },
      },
    });
  }

  /*
    Lista todos os comentários de uma postagem.

    Ordenamos do mais antigo para o mais recente,
    para parecer uma conversa natural.

    Também retornamos os dados do usuário que comentou,
    para o nome continuar aparecendo mesmo depois de atualizar a página.
  */
  async findByPostId(postId: string) {
    return prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            userType: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}
