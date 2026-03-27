import { eq, aliasedTable } from "drizzle-orm";
import { topics, animes, users } from "../../db/schema";
import { db } from "../../db";
import {
  CreateTopicInterface,
  ListTopicsResponseInterface,
  TopicResponseInterface,
  UpdateTopicInterface,
} from "../../interfaces/Topic";
import { SuccessResponseInterface } from "../../interfaces/Success";
import { AuthService } from "../auth/auth.service";

export const TopicsService = {
  verifyTopicExist: async (topicId: string): Promise<boolean> => {
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });
    if (!topic) {
      return false;
    }
    return true;
  },

  verifyUserPermission: async (
    topicId: string,
    userId: string,
  ): Promise<boolean> => {
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });

    if (!topic) {
      return false;
    }

    return AuthService.userIsTheSameOrAdmin(userId, topic.createdByUserId);
  },

  getAllTopics: async (): Promise<ListTopicsResponseInterface> => {
    try {
      const updatedByUsers = aliasedTable(users, "updatedByUsers");

      const result = await db
        .select({
          topic: topics,
          animeInfos: {
            id: animes.id,
            title: animes.title,
            imageUrl: animes.imageUrl,
          },
          createdByUserId: {
            userId: users.id,
            userName: users.userName,
            avatarUrl: users.avatarUrl,
          },
          updatedByUserId: {
            userId: updatedByUsers.id,
            userName: updatedByUsers.userName,
            avatarUrl: updatedByUsers.avatarUrl,
          },
        })
        .from(topics)
        .leftJoin(animes, eq(topics.animeId, animes.id))
        .leftJoin(users, eq(topics.createdByUserId, users.id))
        .leftJoin(
          updatedByUsers,
          eq(topics.updatedByUserId, updatedByUsers.id),
        );

      return result.map((row) => {
        const updatedByUser = row.updatedByUserId?.userId
          ? row.updatedByUserId
          : null;

        const { animeId, createdByUserId, updatedByUserId, ...restTopic } =
          row.topic;

        return {
          ...restTopic,
          animeInfos: row.animeInfos!,
          createdByUserId: row.createdByUserId!,
          updatedByUserId: updatedByUser,
        };
      });
    } catch (error) {
      throw new Error("Não foi possível listar os tópicos - " + error, {
        cause: error,
      });
    }
  },

  getTopicById: async (topicId: string): Promise<TopicResponseInterface> => {
    try {
      const topicExist = await TopicsService.verifyTopicExist(topicId);

      if (!topicExist) {
        throw new Error("Tópico não encontrado.");
      }

      const result = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
        with: {
          animeInfos: true,
          createdByUserId: true,
          updatedByUserId: true,
        },
      });

      if (!result) {
        throw new Error("Tópico não encontrado.");
      }

      return result;
    } catch (error) {
      throw new Error("Não foi possível encontrar o tópico - " + error, {
        cause: error,
      });
    }
  },

  createTopic: async (
    data: CreateTopicInterface,
  ): Promise<SuccessResponseInterface> => {
    try {
      await db.insert(topics).values({
        title: data.title,
        description: data.description,
        animeId: data.animeId,
        createdByUserId: data.userLoggedId,
      });
      return {
        message: "Tópico criado com sucesso!",
        success: true,
        code: 201,
      };
    } catch (error) {
      throw new Error("Não foi possível criar o tópico - " + error, {
        cause: error,
      });
    }
  },

  updateTopic: async (
    data: UpdateTopicInterface,
  ): Promise<SuccessResponseInterface> => {
    try {
      const topicExist = await TopicsService.verifyTopicExist(data.topicId);

      if (!topicExist) {
        throw new Error("Tópico não encontrado.");
      }

      const userPermission = await TopicsService.verifyUserPermission(
        data.topicId,
        data.userLoggedId,
      );

      if (!userPermission) {
        throw new Error("Usuário não autorizado.");
      }

      await db
        .update(topics)
        .set({
          title: data.title,
          description: data.description,
          updatedAt: new Date(),
        })
        .where(eq(topics.id, data.topicId));
      return {
        message: "Tópico atualizado com sucesso!",
        success: true,
        code: 200,
      };
    } catch (error) {
      throw new Error("Não foi possível atualizar o tópico - " + error, {
        cause: error,
      });
    }
  },

  deleteTopic: async (
    topicId: string,
    userLoggedId: string,
  ): Promise<SuccessResponseInterface> => {
    try {
      const topicExist = await TopicsService.verifyTopicExist(topicId);

      if (!topicExist) {
        throw new Error("Tópico não encontrado.");
      }

      const userPermission = await TopicsService.verifyUserPermission(
        topicId,
        userLoggedId,
      );

      if (!userPermission) {
        throw new Error("Usuário não autorizado.");
      }

      await db.delete(topics).where(eq(topics.id, topicId));
      return {
        message: "Tópico deletado com sucesso!",
        success: true,
        code: 200,
      };
    } catch (error) {
      throw new Error("Não foi possível deletar o tópico - " + error, {
        cause: error,
      });
    }
  },
};
