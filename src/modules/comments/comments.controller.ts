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
import { PaginationQuerySchema } from "../../interfaces/Pagination";

export const CommentsController = new Elysia({ prefix: "/comments" }).group(
  "",
  (app) =>
    app
      .model({
        CommentList: CommentListSchema,
        CreateComment: CreateCommentSchema,
        UpdateComment: UpdateCommentSchema,
        DeleteComment: DeleteCommentSchema,
        SuccessResponse: SuccessResponseSchema,
        PaginationQuery: PaginationQuerySchema,
      })
      .use(authPlugin)
      .get(
        "/:topicId",
        ({ params, query }) =>
          CommentsService.getCommentsByTopicId({
            topicId: params.topicId,
            page: query.page ?? 1,
            limit: query.limit ?? 20,
          }),
        {
          params: t.Object({
            topicId: t.String({ format: "uuid" }),
          }),
          query: "PaginationQuery",
          response: "CommentList",
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
          body: "CreateComment",
          response: "SuccessResponse",
        },
      )
      .patch(
        "/",
        ({ body, user }) =>
          CommentsService.updateComment({ ...body, userLoggedId: user!.sub }),
        {
          body: "UpdateComment",
          response: "SuccessResponse",
        },
      )
      .delete(
        "/",
        ({ body, user }) =>
          CommentsService.deleteComment({ ...body, userLoggedId: user!.sub }),
        {
          body: "DeleteComment",
          response: "SuccessResponse",
        },
      ),
);
