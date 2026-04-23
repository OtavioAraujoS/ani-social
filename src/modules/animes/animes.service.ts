import {
  AnimeDetailResponseInterface,
  AnimeStatusEnum,
  CreateAnimeInterface,
  UpdateAnimeImageInterface,
  UpdateAnimeInterface,
} from "../../interfaces/Anime";
import { db } from "../../db";
import { animes, users } from "../../db/schema";
import { eq, aliasedTable, ilike, and, count } from "drizzle-orm";
import { SuccessResponseInterface } from "../../interfaces/Success";
import { uploadImage } from "../../lib/cloudinary";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../users/users.service";
import xss from "xss";

export const AnimeService = {
  verifyAnimeExistence: async (animeId: string): Promise<boolean> => {
    try {
      const [anime] = await db
        .select()
        .from(animes)
        .where(eq(animes.id, animeId));
      if (!anime) return false;
      return true;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Não foi possível verificar os animes", { cause: error });
    }
  },

  duplicatedAnime: async (title: string): Promise<boolean> => {
    try {
      const [existingAnime] = await db
        .select()
        .from(animes)
        .where(eq(animes.title, title));
      if (existingAnime) return true;
      return false;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Não foi possível verificar os animes", { cause: error });
    }
  },

  findAll: async ({
    page,
    limit,
    userId,
    title,
    status,
  }: {
    page: number;
    limit: number;
    userId?: string;
    title?: string;
    status?: AnimeStatusEnum;
  }): Promise<{ data: any[]; total: number }> => {
    try {
      const filters = [];

      if (userId) {
        filters.push(eq(animes.createdByUserId, userId));
      }

      if (title) {
        filters.push(ilike(animes.title, `%${title}%`));
      }

      if (status) {
        filters.push(eq(animes.status, status));
      }

      const whereClause = filters.length > 0 ? and(...filters) : undefined;
      const dataPromise = db
        .select({
          id: animes.id,
          title: animes.title,
          description: animes.description,
          episodes: animes.episodes,
          review: animes.review,
          stars: animes.stars,
          imageUrl: animes.imageUrl,
          status: animes.status,
          createdAt: animes.createdAt,
          updatedAt: animes.updatedAt,
        })
        .from(animes)
        .where(whereClause)
        .limit(limit)
        .offset((page - 1) * limit);

      const countPromise = db
        .select({ total: count() })
        .from(animes)
        .where(whereClause);

      const [data, countResult] = await Promise.all([
        dataPromise,
        countPromise,
      ]);

      return {
        data,
        total: countResult[0].total,
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Não foi possível verificar os animes", { cause: error });
    }
  },

  findById: async (animeId: string): Promise<AnimeDetailResponseInterface> => {
    try {
      const updatedByUsers = aliasedTable(users, "updatedByUsers");

      const [result] = await db
        .select({
          anime: animes,
          createdByUser: {
            name: users.name,
            userName: users.userName,
            rank: users.rank,
            avatarUrl: users.avatarUrl,
          },
          updatedByUser: {
            name: updatedByUsers.name,
            userName: updatedByUsers.userName,
            rank: updatedByUsers.rank,
            avatarUrl: updatedByUsers.avatarUrl,
          },
        })
        .from(animes)
        .leftJoin(users, eq(animes.createdByUserId, users.id))
        .leftJoin(updatedByUsers, eq(animes.updatedByUserId, updatedByUsers.id))
        .where(eq(animes.id, animeId));

      if (!result) throw new Error("Anime não encontrado");

      const { createdByUserId, updatedByUserId, ...animeData } = result.anime;

      const createdByUser = result.createdByUser?.userName
        ? result.createdByUser
        : null;

      const updatedByUser = result.updatedByUser?.userName
        ? result.updatedByUser
        : null;

      return {
        ...animeData,
        createdByUser: createdByUser as any,
        updatedByUser: updatedByUser as any,
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Não foi possível verificar o anime informado", {
        cause: error,
      });
    }
  },

  create: async ({
    title,
    description,
    episodes,
    review,
    stars,
    imageUrl,
    status,
    createdByUserId,
  }: CreateAnimeInterface & {
    createdByUserId: string;
  }): Promise<SuccessResponseInterface> => {
    try {
      const userExist = await UserService.verifyUserExist(createdByUserId);

      if (!userExist) {
        throw new Error("Usuário não encontrado ou não autorizado.");
      }

      const duplicated = await AnimeService.duplicatedAnime(title);

      if (!duplicated) {
        await db.insert(animes).values({
          title: xss(title),
          description: xss(description),
          episodes,
          review: xss(review || ""),
          stars,
          imageUrl,
          status,
          createdByUserId,
        });

        await UserService.syncUserRank(createdByUserId);

        return {
          message: "Anime cadastrado com sucesso!",
          success: true,
          code: 201,
        };
      }
      throw new Error("Anime já cadastrado");
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Não foi possível cadastrar o anime", { cause: error });
    }
  },

  update: async ({
    animeId,
    title,
    description,
    episodes,
    review,
    stars,
    imageUrl,
    status,
    updatedByUserId,
  }: UpdateAnimeInterface & {
    updatedByUserId: string;
  }): Promise<SuccessResponseInterface> => {
    try {
      const userExist = await UserService.verifyUserExist(updatedByUserId);

      if (!userExist) {
        throw new Error("Usuário não encontrado ou não autorizado.");
      }
      const animeExist = await AnimeService.verifyAnimeExistence(animeId);

      if (animeExist) {
        await db
          .update(animes)
          .set({
            title: title ? xss(title) : undefined,
            description: description ? xss(description) : undefined,
            episodes,
            review: review ? xss(review) : undefined,
            stars,
            imageUrl,
            status,
            updatedByUserId,
            updatedAt: new Date(),
          })
          .where(eq(animes.id, animeId));
        return {
          message: "Anime atualizado com sucesso!",
          success: true,
          code: 200,
        };
      }
      throw new Error("Anime não encontrado");
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Não foi possível atualizar o anime", { cause: error });
    }
  },

  updateAnimeImage: async ({
    animeId,
    imageUrl,
    updatedByUserId,
  }: UpdateAnimeImageInterface & {
    updatedByUserId: string;
  }): Promise<SuccessResponseInterface> => {
    try {
      const userExist = await UserService.verifyUserExist(updatedByUserId);

      if (!userExist) {
        throw new Error("Usuário não encontrado ou não autorizado.");
      }
      const animeExist = await AnimeService.verifyAnimeExistence(animeId);

      if (animeExist) {
        const avatarUrl = await uploadImage(imageUrl, "animes");

        await db
          .update(animes)
          .set({
            updatedByUserId: updatedByUserId,
            imageUrl: avatarUrl,
            updatedAt: new Date(),
          })
          .where(eq(animes.id, animeId));
        return {
          message: "Imagem do anime atualizada com sucesso!",
          success: true,
          code: 200,
        };
      }
      throw new Error("Anime não encontrado");
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Não foi possível atualizar a imagem do anime", {
        cause: error,
      });
    }
  },

  deleteAnime: async (
    animeId: string,
    userLoggedId: string,
  ): Promise<SuccessResponseInterface> => {
    try {
      const [anime] = await db
        .select()
        .from(animes)
        .where(eq(animes.id, animeId));

      if (anime) {
        const isAuthorized = await AuthService.userIsTheSameOrAdmin(
          anime.createdByUserId,
          userLoggedId,
        );
        if (!isAuthorized) throw new Error("Usuário não autorizado");
        await db.delete(animes).where(eq(animes.id, animeId));
        return {
          message: "Anime deletado com sucesso!",
          success: true,
          code: 200,
        };
      }
      throw new Error("Anime não encontrado");
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Não foi possível deletar o anime", { cause: error });
    }
  },
};
