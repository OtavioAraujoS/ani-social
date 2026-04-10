import { t } from "elysia";
import { AnimeSchema } from "./Anime";
import { UserInfoSchema } from "./User";

export const DashboardResponseSchema = t.Object({
  recentAnimes: t.Array(
    t.Intersect([
      AnimeSchema,
      t.Object({
        createdByUser: t.Nullable(UserInfoSchema),
        updatedByUser: t.Nullable(UserInfoSchema),
      }),
    ]),
  ),
  recentTopics: t.Array(
    t.Object({
      id: t.String(),
      title: t.String(),
      description: t.String(),
      animeId: t.String(),
      comments: t.Number(),
      createdByUser: t.Nullable(UserInfoSchema),
      updatedByUser: t.Nullable(UserInfoSchema),
      createdAt: t.Date(),
      updatedAt: t.Date(),
    }),
  ),
  releasingAnimes: t.Array(
    t.Intersect([
      AnimeSchema,
      t.Object({
        createdByUser: t.Nullable(UserInfoSchema),
        updatedByUser: t.Nullable(UserInfoSchema),
      }),
    ]),
  ),
});

export type DashboardResponseInterface = typeof DashboardResponseSchema.static;
