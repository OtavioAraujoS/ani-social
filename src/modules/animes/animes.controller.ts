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
      .model({
        AnimeListResponse: AnimeListResponseSchema,
        AnimeDetailResponse: AnimeDetailResponseSchema,
        CreateAnime: CreateAnimeSchema,
        UpdateAnime: UpdateAnimeSchema,
        UpdateAnimeImage: UpdateAnimeImageSchema,
        SuccessResponse: SuccessResponseSchema,
      })
      .get(
        "/",
        ({ query }) =>
          AnimeService.findAll({
            page: query.page ?? 1,
            limit: query.limit ?? 20,
            userId: query.userId,
          }),
        {
          query: t.Object({
            page: t.Optional(t.Number()),
            limit: t.Optional(t.Number()),
            userId: t.Optional(t.String({ format: "uuid" })),
          }),
          response: "AnimeListResponse",
        },
      )
      .get("/:animeId", ({ params }) => AnimeService.findById(params.animeId), {
        params: t.Object({
          animeId: t.String({ format: "uuid" }),
        }),
        response: "AnimeDetailResponse",
      })
      .use(authPlugin)
      .post(
        "/",
        ({ body, user }) =>
          AnimeService.create({ ...body, createdByUserId: user!.sub }),
        {
          body: "CreateAnime",
          response: "SuccessResponse",
        },
      )
      .patch(
        "/",
        ({ body, user }) =>
          AnimeService.update({ ...body, updatedByUserId: user!.sub }),
        {
          body: "UpdateAnime",
          response: "SuccessResponse",
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
          body: "UpdateAnimeImage",
          response: "SuccessResponse",
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
          response: "SuccessResponse",
        },
      ),
);
