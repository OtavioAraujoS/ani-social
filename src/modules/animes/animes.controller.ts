import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth.middleware";
import { AnimeService } from "./animes.service";
import {
  AnimeListResponseSchema,
  AnimeDetailResponseSchema,
  CreateAnimeSchema,
  UpdateAnimeImageSchema,
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
        response: AnimeDetailResponseSchema,
      })
      .post(
        "/",
        ({ body, user }) =>
          AnimeService.create({ ...body, createdByUserId: user!.sub }),
        {
          body: CreateAnimeSchema,
          response: SuccessResponseSchema,
        },
      )
      .patch(
        "/",
        ({ body, user }) =>
          AnimeService.update({ ...body, updatedByUserId: user!.sub }),
        {
          body: UpdateAnimeSchema,
          response: SuccessResponseSchema,
        },
      )
      .patch(
        "/image",
        ({ body, user }) =>
          AnimeService.updateAnimeImage({
            ...body,
            updatedByUserId: user!.sub,
          }),
        {
          body: UpdateAnimeImageSchema,
          response: SuccessResponseSchema,
        },
      )
      .delete(
        "/:animeId",
        ({ params, user }) =>
          AnimeService.deleteAnime(params.animeId, user!.sub),
        {
          params: t.Object({
            animeId: t.String({ format: "uuid" }),
          }),
          response: SuccessResponseSchema,
        },
      ),
);
