import { t } from "elysia";

export const SuccessResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String(),
  code: t.Number(),
});

export type SuccessResponseInterface = typeof SuccessResponseSchema.static;
