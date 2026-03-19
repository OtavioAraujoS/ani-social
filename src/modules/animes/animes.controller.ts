import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth.middleware";
import { AnimeService } from "./animes.service";
import {
  AnimeListResponseSchema,
  AnimeSchema,
  CreateAnimeSchema,
  UpdateAnimeSchema,
} from "../../interfaces/Anime";
import { SuccessResponseSchema } from "../../interfaces/Success";

export const AnimeController = new Elysia({ prefix: "/animes" }).group(
  "",
  (app) =>
    app
      .use(authPlugin)
      .get("/", () => AnimeService.findAll(), {
        response: AnimeListResponseSchema,
      })
      .get("/:animeId", ({ params }) => AnimeService.findById(params.animeId), {
        params: t.Object({
          animeId: t.String({ format: "uuid" }),
        }),
        response: AnimeSchema,
      })
      .post("/", ({ body }) => AnimeService.create(body), {
        body: CreateAnimeSchema,
        response: SuccessResponseSchema,
      })
      .patch("/", ({ body }) => AnimeService.update(body), {
        body: UpdateAnimeSchema,
        response: SuccessResponseSchema,
      }),
);
