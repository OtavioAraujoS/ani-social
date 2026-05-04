import { db } from "../../db";
import { users, animes, topics, comments } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  UserProfileAnimesListResponseInterface,
  UserProfileCommentsListResponseInterface,
  UserProfileInfosResponseInterface,
  UserProfileResponseInterface,
  UserProfileTopicsListResponseInterface,
} from "../../interfaces/Profile";

export const ProfileService = {
  findUserAnimes: async (
    userId: string,
  ): Promise<UserProfileAnimesListResponseInterface> => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) throw new Error("Usuário não encontrado.");

      return await db
        .select({
          id: animes.id,
          title: animes.title,
          episodes: animes.episodes,
          status: animes.status,
          createdAt: animes.createdAt,
          updatedAt: animes.updatedAt,
          cover: animes.imageUrl,
        })
        .from(animes)
        .where(eq(animes.createdByUserId, userId));
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao buscar perfil", { cause: error });
    }
  },

  findTopicsByUser: async (
    userId: string,
  ): Promise<UserProfileTopicsListResponseInterface> => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) throw new Error("Usuário não encontrado.");

      return await db
        .select({
          id: topics.id,
          title: topics.title,
          content: topics.description,
          createdAt: topics.createdAt,
          updatedAt: topics.updatedAt,
        })
        .from(topics)
        .where(eq(topics.createdByUserId, userId));
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao buscar perfil", { cause: error });
    }
  },

  findCommentsByUser: async (
    userId: string,
  ): Promise<UserProfileCommentsListResponseInterface> => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) throw new Error("Usuário não encontrado.");

      return await db
        .select({
          id: comments.id,
          content: comments.content,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
        })
        .from(comments)
        .where(eq(comments.createdByUserId, userId));
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao buscar perfil", { cause: error });
    }
  },

  findUserInfos: async (
    userId: string,
  ): Promise<UserProfileInfosResponseInterface> => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) throw new Error("Usuário não encontrado.");

      return {
        id: user.id,
        username: user.name,
        name: user.name,
        avatarUrl: user.avatarUrl,
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao buscar perfil", { cause: error });
    }
  },

  findUserProfile: async (
    userId: string,
  ): Promise<UserProfileResponseInterface> => {
    try {
      if (!userId) throw new Error("Usuário não informado.");

      const [animeList, topicsList, commentsList, userInfos] =
        await Promise.all([
          ProfileService.findUserAnimes(userId),
          ProfileService.findTopicsByUser(userId),
          ProfileService.findCommentsByUser(userId),
          ProfileService.findUserInfos(userId),
        ]);

      return {
        anime: animeList || [],
        topics: topicsList || [],
        comments: commentsList || [],
        userInfos: userInfos || {},
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao buscar perfil", { cause: error });
    }
  },
};
