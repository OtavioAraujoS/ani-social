import Elysia, { t } from "elysia";
import { AnimeStatusEnum } from "../../interfaces/Anime";
import { authPlugin } from "../auth/auth.middleware";
import { TopicsService } from "./topics.service";
import {
  CreateTopicSchema,
  ListTopicsSchema,
  topicSchema,
  UpdateTopicSchema,
} from "../../interfaces/Topic";
import { SuccessResponseSchema } from "../../interfaces/Success";
import { PaginationQuerySchema } from "../../interfaces/Pagination";

export const TopicController = new Elysia({ prefix: "/topics" }).group(
  "",
  (app) =>
    app
      .model({
        CreateTopic: CreateTopicSchema,
        ListTopics: ListTopicsSchema,
        TopicResponse: topicSchema,
        UpdateTopic: UpdateTopicSchema,
        SuccessResponse: SuccessResponseSchema,
        PaginationQuery: PaginationQuerySchema,
      })
      .get(
        "/",
        ({ query }) =>
          TopicsService.getAllTopics({
            page: query.page ?? 1,
            limit: query.limit ?? 20,
            title: query.title,
            status: query.status,
            animeId: query.animeId,
            userId: query.userId,
          }),
        {
          query: t.Object({
            page: t.Optional(t.Numeric({ default: 1 })),
            limit: t.Optional(t.Numeric({ default: 20 })),
            title: t.Optional(t.String()),
            status: t.Optional(t.Enum(AnimeStatusEnum)),
            animeId: t.Optional(t.String({ format: "uuid" })),
            userId: t.Optional(t.String({ format: "uuid" })),
          }),
          response: "ListTopics",
        },
      )
      .get(
        "/:topicId",
        ({ params }) => TopicsService.getTopicById(params.topicId),
        {
          params: t.Object({
            topicId: t.String({ format: "uuid" }),
          }),
          response: "TopicResponse",
        },
      )
      .use(authPlugin)
      .post(
        "/",
        ({ body, user }) =>
          TopicsService.createTopic({ ...body, userLoggedId: user!.sub }),
        {
          body: "CreateTopic",
          response: "SuccessResponse",
        },
      )
      .patch(
        "/:topicId",
        ({ body, user }) =>
          TopicsService.updateTopic({ ...body, userLoggedId: user!.sub }),
        {
          body: "UpdateTopic",
          response: "SuccessResponse",
        },
      )
      .delete(
        "/:topicId",
        ({ params, user }) =>
          TopicsService.deleteTopic({
            topicId: params.topicId,
            userLoggedId: user!.sub,
          }),
        {
          params: t.Object({
            topicId: t.String({ format: "uuid" }),
          }),
          response: "SuccessResponse",
        },
      ),
);
