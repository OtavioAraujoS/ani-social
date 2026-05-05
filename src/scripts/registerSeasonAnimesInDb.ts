import { AnimeService } from "../modules/animes/animes.service";
import { debounceFunction } from "../utils/debounceFunction";
import { scrapeSeasonAnimes } from "./scrape-season";

/**
 * Função responsável por buscar os animes via scraping e cadastrá-los no banco de dados,
 * evitando a duplicação de animes já existentes pelo título.
 *
 * @param seasonUrl URL para buscar os animes
 * @param createdByUserId ID do usuário que ficará como criador dos animes cadastrados
 */
export async function registerSeasonAnimesInDb(
  seasonUrl: string,
  createdByUserId: string,
) {
  try {
    console.log(`Iniciando busca de animes em: ${seasonUrl}`);
    const animesData = await scrapeSeasonAnimes(seasonUrl);

    if (!animesData || animesData.length === 0) {
      console.log("Nenhum anime encontrado para processar.");
      return 0;
    }

    console.log(`Foram encontrados ${animesData.length} animes no site.`);

    let registeredCount = 0;
    let skippedCount = 0;

    for (const anime of animesData) {
      try {
        const isDuplicated = await AnimeService.duplicatedAnime(anime.title);

        if (!isDuplicated) {
          await AnimeService.create({
            ...anime,
            stars: 0,
            createdByUserId,
          });
          console.log(`[SUCESSO] Anime "${anime.title}" cadastrado.`);
          registeredCount++;
          await debounceFunction(200);
        } else {
          skippedCount++;
        }
      } catch (innerError) {
        console.error(
          `[ERRO] Falha ao cadastrar "${anime.title}":`,
          innerError,
        );
      }
    }

    console.log(`
      -----------------------------------------
      Processo finalizado:
      ✅ Novos: ${registeredCount}
      ⏭️  Pulados (Duplicados): ${skippedCount}
      -----------------------------------------
    `);

    return registeredCount;
  } catch (error) {
    console.error(
      "Erro crítico durante o registro dos animes no banco:",
      error,
    );
    throw error;
  }
}
