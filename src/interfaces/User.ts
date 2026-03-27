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

export const CreateUserSchema = t.Object({
  name: t.String(),
  userName: t.String(),
  password: t.String(),
});

export const UpdateUserSchema = t.Object({
  userId: t.String(),
  name: t.String(),
  userName: t.String(),
});

export const UpdateUserPasswordSchema = t.Object({
  userId: t.String(),
  password: t.String(),
});

export const UpdateUserAvatarSchema = t.Object({
  userId: t.String(),
  imageBase64Path: t.String(),
});

export const DeleteUserSchema = t.Object({
  userId: t.String(),
});

export const UserInfoSchema = t.Object({
  userId: t.String(),
  userName: t.String(),
  avatarUrl: t.Nullable(t.String()),
});

export type UserResponseInterface = typeof UserResponseSchema.static;
export type UsersListResponseInterface = typeof UserListResponseSchema.static;
export type CreateUserInterface = typeof CreateUserSchema.static;
export type UpdateUserInterface = typeof UpdateUserSchema.static;
export type UpdateUserPasswordInterface =
  typeof UpdateUserPasswordSchema.static;
export type UpdateUserAvatarInterface = typeof UpdateUserAvatarSchema.static;
export type DeleteUserInterface = typeof DeleteUserSchema.static;
