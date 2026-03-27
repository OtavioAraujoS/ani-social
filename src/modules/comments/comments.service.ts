import { eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { comments, users, topics } from "../../db/schema";
import {
  CommentListResponseInterface,
  CreateCommentInterface,
  DeleteCommentInterface,
  UpdateCommentInterface,
} from "../../interfaces/Comments";
import { SuccessResponseInterface } from "../../interfaces/Success";
import { AuthService } from "../auth/auth.service";
import { TopicsService } from "../topics/topics.service";

export const CommentsService = {
  verifyCommentExist: async (
    commentId: string,
    topicId: string,
  ): Promise<boolean> => {
    try {
      const topicIdExist = await TopicsService.verifyTopicExist(topicId);

      if (!topicIdExist) {
        throw new Error("Tópico não encontrado.");
      }

      const comment = await db.query.comments.findFirst({
        where: eq(comments.id, commentId),
      });
      if (!comment) {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error("Não foi possível verificar o comentário - " + error, {
        cause: error,
      });
    }
  },

  verifyUserPermission: async (
    commentId: string,
    userId: string,
  ): Promise<boolean> => {
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
    });

    if (!comment) {
      return false;
    }

    return AuthService.userIsTheSameOrAdmin(comment.createdByUserId, userId);
  },

  getCommentsByTopicId: async (
    topicId: string,
  ): Promise<CommentListResponseInterface> => {
    try {
      const topicIdExist = await TopicsService.verifyTopicExist(topicId);

      if (!topicIdExist) {
        throw new Error("Tópico não encontrado.");
      }

      const result = await db
        .select({
          comment: comments,
          createdByUserId: {
            userId: users.id,
            userName: users.userName,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(comments)
        .leftJoin(users, eq(comments.createdByUserId, users.id))
        .where(eq(comments.topicId, topicId));

      return result.map((row) => ({
        id: row.comment.id,
        content: row.comment.content,
        topicId: row.comment.topicId,
        createdByUserId: row.createdByUserId!,
        createdAt: row.comment.createdAt.toISOString(),
        updatedAt: row.comment.updatedAt.toISOString(),
      }));
    } catch (error) {
      throw new Error("Não foi possível listar os comentários - " + error, {
        cause: error,
      });
    }
  },

  postCommentOnTopic: async (
    data: CreateCommentInterface,
  ): Promise<SuccessResponseInterface> => {
    try {
      await db.insert(comments).values({
        content: data.content,
        topicId: data.topicId,
        createdByUserId: data.userLoggedId,
      });

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(comments)
        .where(eq(comments.topicId, data.topicId));

      await db
        .update(topics)
        .set({ comments: Number(count) })
        .where(eq(topics.id, data.topicId));
      return {
        message: "Comentário criado com sucesso!",
        success: true,
        code: 201,
      };
    } catch (error) {
      throw new Error("Não foi possível criar o comentário - " + error, {
        cause: error,
      });
    }
  },

  updateComment: async (
    data: UpdateCommentInterface,
  ): Promise<SuccessResponseInterface> => {
    try {
      const commentExist = await CommentsService.verifyCommentExist(
        data.commentId,
        data.topicId,
      );

      if (!commentExist) {
        throw new Error("Comentário não encontrado.");
      }

      const userPermission = await CommentsService.verifyUserPermission(
        data.commentId,
        data.userLoggedId,
      );

      if (!userPermission) {
        throw new Error("Usuário não autorizado.");
      }

      await db
        .update(comments)
        .set({
          content: data.content,
          updatedAt: new Date(),
        })
        .where(eq(comments.id, data.commentId));
      return {
        message: "Comentário atualizado com sucesso!",
        success: true,
        code: 200,
      };
    } catch (error) {
      throw new Error("Não foi possível atualizar o comentário - " + error, {
        cause: error,
      });
    }
  },

  deleteComment: async (
    data: DeleteCommentInterface,
  ): Promise<SuccessResponseInterface> => {
    try {
      const commentExist = await CommentsService.verifyCommentExist(
        data.commentId,
        data.topicId,
      );

      if (!commentExist) {
        throw new Error("Comentário não encontrado.");
      }

      const userPermission = await CommentsService.verifyUserPermission(
        data.commentId,
        data.userLoggedId,
      );

      if (!userPermission) {
        throw new Error("Usuário não autorizado.");
      }

      await db.delete(comments).where(eq(comments.id, data.commentId));

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(comments)
        .where(eq(comments.topicId, data.topicId));

      await db
        .update(topics)
        .set({ comments: Number(count) })
        .where(eq(topics.id, data.topicId));
      return {
        message: "Comentário deletado com sucesso!",
        success: true,
        code: 200,
      };
    } catch (error) {
      throw new Error("Não foi possível deletar o comentário - " + error, {
        cause: error,
      });
    }
  },
};
