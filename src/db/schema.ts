import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { AnimeStatusEnum } from "../interfaces/Anime";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const animeStatusEnum = pgEnum("anime_status", [
  AnimeStatusEnum.COMPLETED,
  AnimeStatusEnum.RELEASING,
  AnimeStatusEnum.PENDING,
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userName: text("user_name").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").default("USER"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const animes = pgTable("animes", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  episodes: integer("episodes").notNull(),
  review: text("review"),
  stars: integer("stars"),
  imageUrl: text("image_url"),
  createdByUserId: uuid("created_by_user_id").notNull(),
  updatedByUserId: uuid("updated_by_user_id").notNull(),
  status: animeStatusEnum("status").notNull().default(AnimeStatusEnum.PENDING),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
