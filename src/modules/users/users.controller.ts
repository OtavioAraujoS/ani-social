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
import { PaginationQuerySchema } from "../../interfaces/Pagination";

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
      .patch(
        "/",
        ({ body, user }) =>
          UserService.update({ ...body, userLoggedId: user!.sub }),
        {
          body: UpdateUserSchema,
          response: SuccessResponseSchema,
        },
      )
      .patch(
        "/password",
        ({ body, user }) =>
          UserService.updatePassword({ ...body, userLoggedId: user!.sub }),
        {
          body: UpdateUserPasswordSchema,
          response: SuccessResponseSchema,
        },
      )
      .patch(
        "/avatar",
        ({ body, user }) =>
          UserService.updateUserAvatar({ ...body, userLoggedId: user!.sub }),
        {
          body: UpdateUserAvatarSchema,
          response: SuccessResponseSchema,
        },
      ),
  )
  .group("/admin", (app) =>
    app
      .use(adminMiddleware)
      .get("/", ({ query }) => UserService.findAll({ page: query.page ?? 1, limit: query.limit ?? 20 }), {
        query: PaginationQuerySchema,
        response: UserListResponseSchema,
      })
      .delete(
        "/",
        ({ body, user }) =>
          UserService.delete({ ...body, userLoggedId: user!.sub }),
        {
          body: DeleteUserSchema,
          response: SuccessResponseSchema,
        },
      ),
  );
