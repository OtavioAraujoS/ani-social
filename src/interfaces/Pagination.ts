import { t } from "elysia";

export const PaginationQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ default: 1 })),
  limit: t.Optional(t.Numeric({ default: 20 })),
});

export interface PaginationQueryInterface {
  page?: number;
  limit?: number;
}
