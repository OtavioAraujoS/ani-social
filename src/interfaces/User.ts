import { t } from "elysia";

export const UserResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  userName: t.String(),
  avatarUrl: t.Union([t.String(), t.Null()]),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
export const UserListResponseSchema = t.Array(UserResponseSchema);

export const SuccessResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String(),
  code: t.Number(),
});

export const CreateUserSchema = t.Object({
  name: t.String(),
  userName: t.String(),
  password: t.String(),
  role: t.Optional(t.Union([t.Literal("USER"), t.Literal("ADMIN")])),
});

export const UpdateUserSchema = t.Object({
  userId: t.String(),
  name: t.String(),
  userName: t.String(),
  userLoggedId: t.String(),
});

export const UpdateUserPasswordSchema = t.Object({
  userId: t.String(),
  userLoggedId: t.String(),
  password: t.String(),
});

export const UpdateUserAvatarSchema = t.Object({
  userId: t.String(),
  userLoggedId: t.String(),
  imageBase64Path: t.String(),
});

export const DeleteUserSchema = t.Object({
  userId: t.String(),
  userLoggedId: t.String(),
});

export type UserResponseInterface = typeof UserResponseSchema.static;
export type UsersListResponseInterface = typeof UserListResponseSchema.static;
export type SuccessResponseInterface = typeof SuccessResponseSchema.static;
export type CreateUserInterface = typeof CreateUserSchema.static;
export type UpdateUserInterface = typeof UpdateUserSchema.static;
export type UpdateUserPasswordInterface =
  typeof UpdateUserPasswordSchema.static;
export type UpdateUserAvatarInterface = typeof UpdateUserAvatarSchema.static;
export type DeleteUserInterface = typeof DeleteUserSchema.static;
