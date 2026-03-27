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
      .use(authPlugin)
      .get("/", ({ query }) => TopicsService.getAllTopics({ page: query.page ?? 1, limit: query.limit ?? 20 }), {
        query: PaginationQuerySchema,
        response: ListTopicsSchema,
      })
      .get(
        "/:topicId",
        ({ params }) => TopicsService.getTopicById(params.topicId),
        {
          params: t.Object({
            topicId: t.String({ format: "uuid" }),
          }),
          response: topicSchema,
        },
      )
      .post(
        "/",
        ({ body, user }) =>
          TopicsService.createTopic({ ...body, userLoggedId: user!.sub }),
        {
          body: CreateTopicSchema,
          response: SuccessResponseSchema,
        },
      )
      .patch(
        "/:topicId",
        ({ body, user }) =>
          TopicsService.updateTopic({ ...body, userLoggedId: user!.sub }),
        {
          body: UpdateTopicSchema,
          response: SuccessResponseSchema,
        },
      )
      .delete(
        "/:topicId",
        ({ params, user }) =>
          TopicsService.deleteTopic({ topicId: params.topicId, userLoggedId: user!.sub }),
        {
          params: t.Object({
            topicId: t.String({ format: "uuid" }),
          }),
          response: SuccessResponseSchema,
        },
      ),
);
