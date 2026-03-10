import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userName: text("user_name").notNull().unique(),
  role: roleEnum("role").default("USER"),
  createdAt: timestamp("created_at").defaultNow(),
});
