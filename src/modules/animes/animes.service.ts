import {
  AnimeListResponseInterface,
  AnimeResponseInterface,
  CreateAnimeInterface,
  UpdateAnimeImageInterface,
  UpdateAnimeInterface,
} from "../../interfaces/Anime";
import { db } from "../../db";
import { animes } from "../../db/schema";
import { eq } from "drizzle-orm";
import { SuccessResponseInterface } from "../../interfaces/Success";
import { uploadImage } from "../../lib/cloudinary";

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
      throw new Error("Não foi possível verificar os animes - " + error, {
        cause: error,
      });
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
      throw new Error("Não foi possível verificar os animes - " + error, {
        cause: error,
      });
    }
  },

  findAll: async (): Promise<AnimeListResponseInterface> => {
    try {
      return await db.select().from(animes);
    } catch (error) {
      throw new Error("Não foi possível verificar os animes - " + error, {
        cause: error,
      });
    }
  },

  findById: async (animeId: string): Promise<AnimeResponseInterface> => {
    try {
      const [anime] = await db
        .select()
        .from(animes)
        .where(eq(animes.id, animeId));
      if (!anime) throw new Error("Anime não encontrado");
      return anime;
    } catch (error) {
      throw new Error(
        "Não foi possível verificar o anime informado - " + error,
        {
          cause: error,
        },
      );
    }
  },

  create: async (
    anime: CreateAnimeInterface,
  ): Promise<SuccessResponseInterface> => {
    try {
      const duplicated = await AnimeService.duplicatedAnime(anime.title);

      if (!duplicated) {
        await db.insert(animes).values(anime);
        return {
          message: "Anime cadastrado com sucesso!",
          success: true,
          code: 201,
        };
      }
      throw new Error("Anime já cadastrado");
    } catch (error) {
      throw new Error("Não foi possível cadastrar o anime - " + error, {
        cause: error,
      });
    }
  },

  update: async (
    anime: UpdateAnimeInterface,
  ): Promise<SuccessResponseInterface> => {
    try {
      const animeExist = await AnimeService.verifyAnimeExistence(anime.animeId);

      if (animeExist) {
        await db.update(animes).set(anime).where(eq(animes.id, anime.animeId));
        return {
          message: "Anime atualizado com sucesso!",
          success: true,
          code: 200,
        };
      }
      throw new Error("Anime não encontrado");
    } catch (error) {
      throw new Error("Não foi possível atualizar o anime - " + error, {
        cause: error,
      });
    }
  },

  updateAnimeImage: async (
    anime: UpdateAnimeImageInterface,
  ): Promise<SuccessResponseInterface> => {
    try {
      const animeExist = await AnimeService.verifyAnimeExistence(anime.animeId);

      if (animeExist) {
        const avatarUrl = await uploadImage(anime.imageUrl, "animes");

        await db
          .update(animes)
          .set({
            updatedByUserId: anime.updatedByUserId,
            imageUrl: avatarUrl,
            updatedAt: new Date(),
          })
          .where(eq(animes.id, anime.animeId));
        return {
          message: "Imagem do anime atualizada com sucesso!",
          success: true,
          code: 200,
        };
      }
      throw new Error("Anime não encontrado");
    } catch (error) {
      throw new Error(
        "Não foi possível atualizar a imagem do anime - " + error,
        {
          cause: error,
        },
      );
    }
  },

  deleteAnime: async (animeId: string): Promise<SuccessResponseInterface> => {
    try {
      const animeExist = await AnimeService.verifyAnimeExistence(animeId);

      if (animeExist) {
        await db.delete(animes).where(eq(animes.id, animeId));
        return {
          message: "Anime deletado com sucesso!",
          success: true,
          code: 200,
        };
      }
      throw new Error("Anime não encontrado");
    } catch (error) {
      throw new Error("Não foi possível deletar o anime - " + error, {
        cause: error,
      });
    }
  },
};
