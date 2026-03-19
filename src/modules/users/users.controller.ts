import Elysia from "elysia";
import { UserService } from "./users.service";
import {
  CreateUserSchema,
  DeleteUserSchema,
  UpdateUserAvatarSchema,
  UpdateUserPasswordSchema,
  UpdateUserSchema,
  UserResponseSchema,
  UserListResponseSchema,
} from "../../interfaces/User";
import { adminMiddleware, authPlugin } from "../auth/auth.middleware";
import { SuccessResponseSchema } from "../../interfaces/Success";

export const UserController = new Elysia({ prefix: "/users" })
  .post("/", ({ body }) => UserService.create(body), {
    body: CreateUserSchema,
    response: SuccessResponseSchema,
  })

  .group("", (app) =>
    app
      .use(authPlugin)
      .get("/:userId", ({ params }) => UserService.findById(params.userId), {
        response: UserResponseSchema,
      })
      .patch("/", ({ body }) => UserService.update(body), {
        body: UpdateUserSchema,
        response: SuccessResponseSchema,
      })
      .patch("/password", ({ body }) => UserService.updatePassword(body), {
        body: UpdateUserPasswordSchema,
        response: SuccessResponseSchema,
      })
      .patch("/avatar", ({ body }) => UserService.updateUserAvatar(body), {
        body: UpdateUserAvatarSchema,
        response: SuccessResponseSchema,
      }),
  )
  .group("/admin", (app) =>
    app
      .use(adminMiddleware)
      .get("/", () => UserService.findAll(), {
        response: UserListResponseSchema,
      })
      .delete("/", ({ body }) => UserService.delete(body), {
        body: DeleteUserSchema,
        response: SuccessResponseSchema,
      }),
  );
