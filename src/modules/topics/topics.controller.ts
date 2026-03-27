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

export const TopicController = new Elysia({ prefix: "/topics" }).group(
  "",
  (app) =>
    app
      .use(authPlugin)
      .get("/", () => TopicsService.getAllTopics(), {
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
      .post("/", ({ body }) => TopicsService.createTopic(body), {
        body: CreateTopicSchema,
        response: SuccessResponseSchema,
      })
      .patch("/:topicId", ({ body }) => TopicsService.updateTopic(body), {
        body: UpdateTopicSchema,
        response: SuccessResponseSchema,
      })
      .delete(
        "/:topicId",
        ({ params, user }) =>
          TopicsService.deleteTopic(params.topicId, user!.sub),
        {
          params: t.Object({
            topicId: t.String({ format: "uuid" }),
          }),
          response: SuccessResponseSchema,
        },
      ),
);
