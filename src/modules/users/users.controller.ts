import Elysia from "elysia";
import { UserService } from "./users.service";
import {
  CreateUserSchema,
  DeleteUserSchema,
  UpdateUserAvatarSchema,
  UpdateUserPasswordSchema,
  UpdateUserSchema,
} from "../../interfaces/User";
import { adminMiddleware, authPlugin } from "../auth/auth.middleware";

export const userController = new Elysia({ prefix: "/users" })
  .get("/:userId", ({ params }) => UserService.findById(params.userId))
  .post("/", ({ body }) => UserService.create(body), {
    body: CreateUserSchema,
  })

  .group("/me", (app) =>
    app
      .use(authPlugin)
      .patch("/", ({ body }) => UserService.update(body), {
        body: UpdateUserSchema,
      })
      .patch("/password", ({ body }) => UserService.updatePassword(body), {
        body: UpdateUserPasswordSchema,
      })
      .patch("/avatar", ({ body }) => UserService.updateUserAvatar(body), {
        body: UpdateUserAvatarSchema,
      }),
  )
  .group("/admin", (app) =>
    app
      .use(adminMiddleware)
      .get("/", () => UserService.findAll())
      .delete("/", ({ body }) => UserService.delete(body), {
        body: DeleteUserSchema,
      }),
  );
