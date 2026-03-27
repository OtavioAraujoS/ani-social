import { t } from "elysia";
import { UserInfoSchema } from "./User";

export const CommentSchema = t.Object({
  id: t.String(),
  content: t.String(),
  topicId: t.String(),
  createdByUserId: UserInfoSchema,
  createdAt: t.String(),
  updatedAt: t.String(),
});

export const CommentListSchema = t.Array(CommentSchema);

export const CreateCommentSchema = t.Object({
  content: t.String(),
  topicId: t.String(),
});

export const UpdateCommentSchema = t.Object({
  commentId: t.String(),
  content: t.String(),
  topicId: t.String(),
});

export const DeleteCommentSchema = t.Object({
  commentId: t.String(),
  topicId: t.String(),
});

export type CommentResponseInterface = typeof CommentSchema.static;
export type CommentListResponseInterface = typeof CommentListSchema.static;
export type CreateCommentInterface = typeof CreateCommentSchema.static;
export type UpdateCommentInterface = typeof UpdateCommentSchema.static;
export type DeleteCommentInterface = typeof DeleteCommentSchema.static;
