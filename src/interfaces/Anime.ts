import { t } from "elysia";

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
  createdByUserId: t.String(),
  updatedByUserId: t.String(),
  status: t.Enum(AnimeStatusEnum),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const AnimeListResponseSchema = t.Array(AnimeSchema);

export const CreateAnimeSchema = t.Object({
  title: t.String(),
  description: t.String(),
  episodes: t.Number(),
  review: t.String(),
  stars: t.Number(),
  imageUrl: t.String(),
  createdByUserId: t.String(),
  updatedByUserId: t.String(),
  status: t.Enum(AnimeStatusEnum),
});

export const UpdateAnimeSchema = t.Object({
  animeId: t.String(),
  title: t.String(),
  description: t.String(),
  episodes: t.Number(),
  review: t.String(),
  stars: t.Number(),
  imageUrl: t.String(),
  createdByUserId: t.String(),
  updatedByUserId: t.String(),
  status: t.Enum(AnimeStatusEnum),
});

export const UpdateAnimeImageSchema = t.Object({
  animeId: t.String(),
  imageUrl: t.String(),
  updatedByUserId: t.String(),
});

export const DeleteAnimeSchema = t.Object({
  animeId: t.String(),
  userLoggedId: t.String(),
});

export type AnimeResponseInterface = typeof AnimeSchema.static;
export type AnimeListResponseInterface = typeof AnimeListResponseSchema.static;
export type CreateAnimeInterface = typeof CreateAnimeSchema.static;
export type UpdateAnimeInterface = typeof UpdateAnimeSchema.static;
export type UpdateAnimeImageInterface = typeof UpdateAnimeImageSchema.static;
export type DeleteAnimeInterface = typeof DeleteAnimeSchema.static;
