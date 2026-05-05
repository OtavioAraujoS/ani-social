import axios from "axios";
import * as cheerio from "cheerio";
import { CreateAnimeInterface, AnimeStatusEnum } from "../interfaces/Anime";

/**
 * Função para buscar detalhes de um anime específico
 * @param url Link da página do anime (ex: MyAnimeList)
 */
export async function scrapeSingleAnime(
  url: string,
): Promise<CreateAnimeInterface | null> {
  try {
    if (!url) {
      throw new Error("URL não informada.");
    }

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);

    const title = $(".title-name").text().trim();

    const description = $('p[itemprop="description"]').text().trim();

    const imageUrl =
      $('img[itemprop="image"]').attr("src") ||
      $('img[itemprop="image"]').attr("data-src");

    const episodesText = $(".spaceit_pad")
      .filter((_, el) => $(el).text().includes("Episodes:"))
      .text()
      .replace("Episodes:", "")
      .trim();

    const episodes = parseInt(episodesText, 10) || 0;

    const statusText = $(".spaceit_pad")
      .filter((_, el) => $(el).text().includes("Status:"))
      .text()
      .toLowerCase();

    let status = AnimeStatusEnum.RELEASING;
    if (statusText.includes("currently airing")) {
      status = AnimeStatusEnum.RELEASING;
    } else if (statusText.includes("finished airing")) {
      status = AnimeStatusEnum.COMPLETED;
    }

    if (!title) return null;

    return {
      title,
      description: description || "Sem descrição disponível.",
      episodes,
      review: "Ainda não assisti",
      stars: 0,
      imageUrl: imageUrl || undefined,
      status,
    } as CreateAnimeInterface;
  } catch (error) {
    console.error("Erro ao fazer scraping da página individual:", error);
    throw new Error("Falha ao buscar detalhes do anime.");
  }
}
