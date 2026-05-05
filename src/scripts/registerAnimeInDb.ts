import { AnimeService } from "../modules/animes/animes.service";
import { scrapeSingleAnime } from "./scrapeSingleAnime";

/**
 * Busca os detalhes de um anime individual via scraping e cadastra no banco.
 *
 * @param animeUrl URL da página individual do anime
 * @param createdByUserId ID do usuário que está adicionando o anime
 * @returns O objeto do anime cadastrado ou null caso seja duplicado
 */
export async function registerSingleAnimeInDb(url: string) {
  try {
    console.log(`🔍 Iniciando extração individual`);

    const animeData = await scrapeSingleAnime(url);

    if (!animeData) {
      console.error("❌ Não foi possível extrair dados desta URL.");
      return null;
    }

    const isDuplicated = await AnimeService.duplicatedAnime(animeData.title);

    if (isDuplicated) {
      console.log(
        `⏭️  O anime "${animeData.title}" já existe no banco. Ignorando.`,
      );
      return null;
    }

    const newAnime = await AnimeService.create({
      ...animeData,
      stars: 0,
      createdByUserId: "08a189fd-269b-4fb4-a410-c36bab1f82e2",
    });

    console.log(`✅ [SUCESSO] "${animeData.title}" cadastrado com sucesso!`);

    return newAnime;
  } catch (error) {
    console.error("❌ Erro ao registrar anime individual:", error);
    throw error;
  }
}

registerSingleAnimeInDb("");
