import {
  AnimeListResponseInterface,
  AnimeResponseInterface,
  CreateAnimeInterface,
} from "../../interfaces/Anime";
import { db } from "../../db";
import { animes } from "../../db/schema";
import { eq } from "drizzle-orm";
import { SuccessResponseInterface } from "../../interfaces/Success";

export const AnimeService = {
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
};
