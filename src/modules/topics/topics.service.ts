import { eq, aliasedTable } from "drizzle-orm";
import { topics, animes, users, comments } from "../../db/schema";
import { db } from "../../db";
import {
  CreateTopicInterface,
  ListTopicsResponseInterface,
  TopicResponseInterface,
  UpdateTopicInterface,
  DeleteTopicInterface,
} from "../../interfaces/Topic";
import { SuccessResponseInterface } from "../../interfaces/Success";
import { AuthService } from "../auth/auth.service";
import xss from "xss";

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

  getAllTopics: async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<ListTopicsResponseInterface> => {
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
        .leftJoin(updatedByUsers, eq(topics.updatedByUserId, updatedByUsers.id))
        .limit(limit)
        .offset((page - 1) * limit);

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
        .leftJoin(updatedByUsers, eq(topics.updatedByUserId, updatedByUsers.id))
        .where(eq(topics.id, topicId));

      if (!result || result.length === 0) {
        throw new Error("Tópico não encontrado.");
      }

      const row = result[0];
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
    } catch (error) {
      throw new Error("Não foi possível encontrar o tópico - " + error, {
        cause: error,
      });
    }
  },

  createTopic: async ({
    title,
    description,
    animeId,
    userLoggedId,
  }: CreateTopicInterface & {
    userLoggedId: string;
  }): Promise<SuccessResponseInterface> => {
    try {
      await db.insert(topics).values({
        title: xss(title),
        description: xss(description),
        animeId,
        createdByUserId: userLoggedId,
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

  updateTopic: async ({
    topicId,
    title,
    description,
    userLoggedId,
  }: UpdateTopicInterface & {
    userLoggedId: string;
  }): Promise<SuccessResponseInterface> => {
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

      await db
        .update(topics)
        .set({
          title: title ? xss(title) : undefined,
          description: description ? xss(description) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(topics.id, topicId));
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

  deleteTopic: async ({
    topicId,
    userLoggedId,
  }: DeleteTopicInterface & {
    userLoggedId: string;
  }): Promise<SuccessResponseInterface> => {
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
