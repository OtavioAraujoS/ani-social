import { t } from "elysia";

const AnimeSchema = t.Object({
  id: t.String(),
  title: t.String(),
  episodes: t.Number(),
  status: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  cover: t.Nullable(t.String()),
});

export const UserProfileAnimesListResponseSchema = t.Array(AnimeSchema);

const TopicSchema = t.Object({
  id: t.String(),
  title: t.String(),
  content: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const UserProfileTopicsListResponseSchema = t.Array(TopicSchema);

const CommentSchema = t.Object({
  id: t.String(),
  content: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const UserProfileCommentsListResponseSchema = t.Array(CommentSchema);

export const UserProfileInfosResponseSchema = t.Object({
  id: t.String(),
  username: t.String(),
  name: t.String(),
  avatarUrl: t.Nullable(t.String()),
});

export type UserProfileInfosResponseInterface =
  typeof UserProfileInfosResponseSchema.static;

export const UserProfileResponseSchema = t.Object({
  anime: UserProfileAnimesListResponseSchema,
  topics: UserProfileTopicsListResponseSchema,
  comments: UserProfileCommentsListResponseSchema,
  userInfos: UserProfileInfosResponseSchema,
});

export type UserProfileAnimesListResponseInterface =
  typeof UserProfileAnimesListResponseSchema.static;

export type UserProfileTopicsListResponseInterface =
  typeof UserProfileTopicsListResponseSchema.static;

export type UserProfileCommentsListResponseInterface =
  typeof UserProfileCommentsListResponseSchema.static;

export type UserProfileResponseInterface =
  typeof UserProfileResponseSchema.static;
