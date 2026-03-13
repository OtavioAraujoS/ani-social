import Elysia, { t } from "elysia";
import { UserService } from "./users.service";
import { CreateUserSchema, DeleteUserSchema } from "../../interfaces/User";

export const userController = new Elysia({ prefix: "/users" })
  .get("/", () => UserService.findAll())
  .post("/", ({ body }) => UserService.create(body), {
    body: CreateUserSchema,
  })
  .delete("/", ({ body }) => UserService.delete(body), {
    body: DeleteUserSchema,
  });
    
