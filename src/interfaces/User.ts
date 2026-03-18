import { t } from "elysia";

export const CreateUserSchema = t.Object({
  name: t.String(),
  userName: t.String(),
  password: t.String(),
});

export const UpdateUserSchema = t.Object({
  userId: t.String(),
  name: t.String(),
  userName: t.String(),
  password: t.String(),
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

export type CreateUserInterface = typeof CreateUserSchema.static;
export type UpdateUserInterface = typeof UpdateUserSchema.static;
export type UpdateUserPasswordInterface =
  typeof UpdateUserPasswordSchema.static;
export type UpdateUserAvatarInterface = typeof UpdateUserAvatarSchema.static;
export type DeleteUserInterface = typeof DeleteUserSchema.static;
