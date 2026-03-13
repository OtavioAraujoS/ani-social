import { t } from "elysia";

export const CreateUserSchema = t.Object({
  name: t.String(),
  userName: t.String(),
  password: t.String(),
});

export const UpdateUserSchema = t.Object({
  id: t.String(),
  name: t.String(),
  userName: t.String(),
  password: t.String(),
});

export const UpdateUserPasswordSchema = t.Object({
  id: t.String(),
  password: t.String(),
});

export const DeleteUserSchema = t.Object({
  id: t.String(),
});

export type CreateUserInterface = typeof CreateUserSchema.static;
export type UpdateUserInterface = typeof UpdateUserSchema.static;
export type UpdateUserPasswordInterface = typeof UpdateUserPasswordSchema.static;
export type DeleteUserInterface = typeof DeleteUserSchema.static;
