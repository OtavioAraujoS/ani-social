import axios from "axios";
import * as cheerio from "cheerio";
import { CreateAnimeInterface, AnimeStatusEnum } from "../interfaces/Anime";

export async function scrapeSeasonAnimes(
  url: string,
): Promise<CreateAnimeInterface[]> {
  try {
    if (!url) {
      throw new Error("URL do site não informado.");
    }

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);
    const animes: CreateAnimeInterface[] = [];

    $(".seasonal-anime").each((_, element) => {
      const title = $(element).find(".link-title").text().trim();
      const description = $(element).find(".synopsis .preline").text().trim();

      const infoText = $(element).find(".info").text().trim();

      const episodesMatch = infoText.match(/(\d+)\s+eps/);

      const episodes = episodesMatch ? parseInt(episodesMatch[1], 10) : 0;

      const imageElement = $(element).find("img");
      const imageUrl =
        imageElement.attr("data-src") || imageElement.attr("src") || null;

      const status = AnimeStatusEnum.RELEASING;

      if (title) {
        animes.push({
          title,
          description: description || "Sem descrição disponível.",
          episodes,
          review: "Ainda não assisti",
          stars: undefined,
          imageUrl: imageUrl || undefined,
          status,
        } as CreateAnimeInterface);
      }
    });

    return animes;
  } catch (error) {
    console.error("Erro ao fazer scraping da página:", error);
    throw new Error("Falha ao buscar animes da temporada do site informado.");
  }
}

const URL_TESTE = "https://myanimelist.net/anime/season";

console.log("🚀 Iniciando teste de extração...");

const resultado = await scrapeSeasonAnimes(URL_TESTE);

if (resultado.length === 0) {
  console.log(
    "⚠️  A função retornou uma lista VAZIA. Verifique se os seletores (.anime-item) estão corretos para este site.",
  );
} else {
  console.log(`✅ Sucesso! Foram encontrados ${resultado.length} animes.`);
}
