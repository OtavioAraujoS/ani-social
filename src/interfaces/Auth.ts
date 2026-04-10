import { t } from "elysia";

export const LoginSchema = t.Object({
  userName: t.String(),
  password: t.String(),
});

export const LoginResponseSchema = t.Object({
  message: t.String(),
  token: t.String(),
});

export type LoginInterface = typeof LoginSchema.static;
export type LoginResponseInterface = typeof LoginResponseSchema.static;
