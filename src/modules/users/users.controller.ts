import Elysia from "elysia";
import { UserService } from "./users.service";
import {
  CreateUserSchema,
  DeleteUserSchema,
  UpdateUserAvatarSchema,
  UpdateUserPasswordSchema,
  UpdateUserSchema,
} from "../../interfaces/User";

export const userController = new Elysia({ prefix: "/users" })
  .get("/", () => UserService.findAll())
  .post("/", ({ body }) => UserService.create(body), {
    body: CreateUserSchema,
  })
  .put("/", ({ body }) => UserService.update(body), {
    body: UpdateUserSchema,
  })
  .patch("/", ({ body }) => UserService.updatePassword(body), {
    body: UpdateUserPasswordSchema,
  })
  .patch("/avatar", ({ body }) => UserService.updateUserAvatar(body), {
    body: UpdateUserAvatarSchema,
  })
  .delete("/", ({ body }) => UserService.delete(body), {
    body: DeleteUserSchema,
  });
