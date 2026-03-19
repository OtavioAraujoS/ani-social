import Elysia from "elysia";
import { authPlugin } from "../auth/auth.middleware";
import { AnimeService } from "./animes.service";
import { AnimeListResponseSchema, AnimeSchema } from "../../interfaces/Anime";

export const AnimeController = new Elysia({ prefix: "/animes" }).group(
  "",
  (app) =>
    app
      .use(authPlugin)
      .get("/", () => AnimeService.findAll(), {
        response: AnimeListResponseSchema,
      })
      .get("/:animeId", ({ params }) => AnimeService.findById(params.animeId), {
        response: AnimeSchema,
      }),
);
