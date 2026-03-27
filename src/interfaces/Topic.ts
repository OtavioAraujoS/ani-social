import { t } from "elysia";
import { AnimeSchemaOnTopic } from "./Anime";
import { UserInfoSchema } from "./User";

export const topicSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.String(),
  animeInfos: AnimeSchemaOnTopic,
  createdByUserId: UserInfoSchema,
  updatedByUserId: t.Nullable(UserInfoSchema),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  comments: t.Number(),
});

export const ListTopicsSchema = t.Array(topicSchema);

export const CreateTopicSchema = t.Object({
  title: t.String(),
  description: t.String(),
  animeId: t.String(),
  userLoggedId: t.String(),
});

export const UpdateTopicSchema = t.Object({
  topicId: t.String(),
  title: t.String(),
  description: t.String(),
  userLoggedId: t.String(),
});

export const DeleteTopicSchema = t.Object({
  topicId: t.String(),
  userLoggedId: t.String(),
});

export type TopicResponseInterface = typeof topicSchema.static;
export type ListTopicsResponseInterface = typeof ListTopicsSchema.static;
export type CreateTopicInterface = typeof CreateTopicSchema.static;
export type UpdateTopicInterface = typeof UpdateTopicSchema.static;
export type DeleteTopicInterface = typeof DeleteTopicSchema.static;
