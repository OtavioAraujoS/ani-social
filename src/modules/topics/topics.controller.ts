import Elysia, { t } from "elysia";
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
          }),
        {
          query: "PaginationQuery",
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
