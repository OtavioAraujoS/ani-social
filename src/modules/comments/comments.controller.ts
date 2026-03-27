import Elysia, { t } from "elysia";
import { authPlugin } from "../auth/auth.middleware";
import { CommentsService } from "./comments.service";
import {
  CommentListSchema,
  CreateCommentSchema,
  DeleteCommentSchema,
  UpdateCommentSchema,
} from "../../interfaces/Comments";
import { SuccessResponseSchema } from "../../interfaces/Success";

export const CommentsController = new Elysia({ prefix: "/comments" }).group(
  "",
  (app) =>
    app
      .use(authPlugin)
      .get(
        "/:topicId",
        ({ params }) => CommentsService.getCommentsByTopicId(params.topicId),
        {
          params: t.Object({
            topicId: t.String({ format: "uuid" }),
          }),
          response: CommentListSchema,
        },
      )
      .post("/", ({ body }) => CommentsService.postCommentOnTopic(body), {
        body: CreateCommentSchema,
        response: SuccessResponseSchema,
      })
      .patch("/:commentId", ({ body }) => CommentsService.updateComment(body), {
        body: UpdateCommentSchema,
        response: SuccessResponseSchema,
      })
      .delete(
        "/:commentId",
        ({ body }) => CommentsService.deleteComment(body),
        {
          body: DeleteCommentSchema,
          response: SuccessResponseSchema,
        },
      ),
);
