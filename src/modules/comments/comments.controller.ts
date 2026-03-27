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
      .post(
        "/",
        ({ body, user }) =>
          CommentsService.postCommentOnTopic({
            ...body,
            userLoggedId: user!.sub,
          }),
        {
          body: CreateCommentSchema,
          response: SuccessResponseSchema,
        },
      )
      .patch(
        "/",
        ({ body, user }) =>
          CommentsService.updateComment({ ...body, userLoggedId: user!.sub }),
        {
          body: UpdateCommentSchema,
          response: SuccessResponseSchema,
        },
      )
      .delete(
        "/",
        ({ body, user }) =>
          CommentsService.deleteComment({ ...body, userLoggedId: user!.sub }),
        {
          body: DeleteCommentSchema,
          response: SuccessResponseSchema,
        },
      ),
);
