import {
  AnimeListResponseInterface,
  AnimeResponseInterface,
} from "../../interfaces/Anime";
import { db } from "../../db";
import { animes } from "../../db/schema";
import { eq } from "drizzle-orm";

export const AnimeService = {
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
};
