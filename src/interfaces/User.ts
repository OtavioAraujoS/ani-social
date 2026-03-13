import { t } from "elysia";

export const CreateUserSchema = t.Object({
  name: t.String(),
  userName: t.String(),
  password: t.String(),
});

export const DeleteUserSchema = t.Object({
  id: t.String(),
});

export type CreateUserInterface = typeof CreateUserSchema.static;
export type DeleteUserInterface = typeof DeleteUserSchema.static;
