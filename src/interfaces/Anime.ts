import { t } from "elysia";
import { UserInfoSchema } from "./User";

export enum AnimeStatusEnum {
  COMPLETED = "COMPLETED",
  RELEASING = "RELEASING",
  PENDING = "PENDING",
}

export const AnimeSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.String(),
  episodes: t.Number(),
  review: t.Nullable(t.String()),
  stars: t.Nullable(t.Number()),
  imageUrl: t.Nullable(t.String()),
  status: t.Enum(AnimeStatusEnum),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const AnimeSchemaOnTopic = t.Object({
  id: t.String(),
  title: t.String(),
  imageUrl: t.Nullable(t.String()),
});

export const AnimeListResponseSchema = t.Array(AnimeSchema);

export const CreateAnimeSchema = t.Object({
  title: t.String(),
  description: t.String(),
  episodes: t.Number(),
  review: t.Optional(t.String()),
  stars: t.Optional(t.Number()),
  imageUrl: t.Optional(t.String()),
  status: t.Optional(t.Enum(AnimeStatusEnum)),
});

export const UpdateAnimeSchema = t.Object({
  animeId: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  episodes: t.Optional(t.Number()),
  review: t.Optional(t.String()),
  stars: t.Optional(t.Number()),
  imageUrl: t.Optional(t.String()),
  status: t.Optional(t.Enum(AnimeStatusEnum)),
});

export const UpdateAnimeImageSchema = t.Object({
  animeId: t.String(),
  imageUrl: t.String(),
});

export const DeleteAnimeSchema = t.Object({
  animeId: t.String(),
});

export const AnimeDetailResponseSchema = t.Intersect([
  AnimeSchema,
  t.Object({
    createdByUser: UserInfoSchema,
    updatedByUser: t.Nullable(UserInfoSchema),
  }),
]);

export type AnimeDetailResponseInterface =
  typeof AnimeDetailResponseSchema.static;
export type AnimeListResponseInterface = typeof AnimeListResponseSchema.static;
export type CreateAnimeInterface = typeof CreateAnimeSchema.static;
export type UpdateAnimeInterface = typeof UpdateAnimeSchema.static;
export type UpdateAnimeImageInterface = typeof UpdateAnimeImageSchema.static;
export type DeleteAnimeInterface = typeof DeleteAnimeSchema.static;
