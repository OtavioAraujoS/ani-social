import { t } from "elysia";

export const CreateUserSchema = t.Object({
  name: t.String(),
  userName: t.String(),
});

export type CreateUserInterface = typeof CreateUserSchema.static;
