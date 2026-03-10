import Elysia from "elysia";
import { UserService } from "./users.service";
import { CreateUserSchema } from "../../interfaces/User";

export const userController = new Elysia({ prefix: "/users" })
  .get("/", () => UserService.findAll())
  .post("/", ({ body }) => UserService.create(body), {
    body: CreateUserSchema,
  });
