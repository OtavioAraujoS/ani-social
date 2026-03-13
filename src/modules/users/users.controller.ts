import Elysia, { t } from "elysia";
import { UserService } from "./users.service";
import { CreateUserSchema, DeleteUserSchema, UpdateUserSchema } from "../../interfaces/User";

export const userController = new Elysia({ prefix: "/users" })
  .get("/", () => UserService.findAll())
  .post("/", ({ body }) => UserService.create(body), {
    body: CreateUserSchema,
  })
  .patch("/", ({ body }) => UserService.update(body), {
    body: UpdateUserSchema,
  })
  .delete("/", ({ body }) => UserService.delete(body), {
    body: DeleteUserSchema,
  });
    
