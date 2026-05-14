import { AnimeService } from "../animes/animes.service";
import { scrapeSingleAnime } from "../../scripts/scrapeSingleAnime";
import { SuccessResponseInterface } from "../../interfaces/Success";

export const ScriptsService = {
  importAnimeFromUrl: async (
    url: string,
    createdByUserId: string,
  ): Promise<SuccessResponseInterface> => {
    try {
      console.log(`🔍 Iniciando extração individual de: ${url}`);

      const animeData = await scrapeSingleAnime(url);

      if (!animeData) {
        throw new Error("Não foi possível extrair dados desta URL.");
      }

      const isDuplicated = await AnimeService.duplicatedAnime(animeData.title);

      if (isDuplicated) {
        throw new Error(`O anime "${animeData.title}" já existe no banco.`);
      }

      const newAnime = await AnimeService.create({
        ...animeData,
        createdByUserId,
      });

      console.log(`✅ [SUCESSO] "${animeData.title}" cadastrado com sucesso!`);

      return newAnime;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao registrar anime individual", { cause: error });
    }
  },
};
