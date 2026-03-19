import { AnimeListResponseInterface } from "../../interfaces/Anime";
import { db } from "../../db";
import { animes } from "../../db/schema";

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
};
