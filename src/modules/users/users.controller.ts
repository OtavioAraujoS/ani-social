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

export const UserController = new Elysia()
  .model({
    CreateUser: CreateUserSchema,
    UpdateUser: UpdateUserSchema,
    UpdateUserPassword: UpdateUserPasswordSchema,
    UpdateUserAvatar: UpdateUserAvatarSchema,
    DeleteUser: DeleteUserSchema,
    UserResponse: UserResponseSchema,
    UserListResponse: UserListResponseSchema,
    SuccessResponse: SuccessResponseSchema,
    PaginationQuery: PaginationQuerySchema,
  })
  .post("/", ({ body }) => UserService.create(body), {
    body: "CreateUser",
    response: "SuccessResponse",
  })

  .group("", (app) =>
    app
      .use(authPlugin)
      .get("/:userId", ({ params }) => UserService.findById(params.userId), {
        response: "UserResponse",
      })
      .patch(
        "/",
        ({ body, user }) =>
          UserService.update({ ...body, userLoggedId: user!.sub }),
        {
          body: "UpdateUser",
          response: "SuccessResponse",
        },
      )
      .patch(
        "/password",
        ({ body, user }) =>
          UserService.updatePassword({ ...body, userLoggedId: user!.sub }),
        {
          body: "UpdateUserPassword",
          response: "SuccessResponse",
        },
      )
      .patch(
        "/avatar",
        ({ body, user }) =>
          UserService.updateUserAvatar({ ...body, userLoggedId: user!.sub }),
        {
          body: "UpdateUserAvatar",
          response: "SuccessResponse",
        },
      ),
  )
  .group("/admin", (app) =>
    app
      .use(adminMiddleware)
      .get(
        "/",
        ({ query }) =>
          UserService.findAll({
            page: query.page ?? 1,
            limit: query.limit ?? 20,
          }),
        {
          query: "PaginationQuery",
          response: "UserListResponse",
        },
      )
      .delete(
        "/",
        ({ body, user }) =>
          UserService.delete({ ...body, userLoggedId: user!.sub }),
        {
          body: "DeleteUser",
          response: "SuccessResponse",
        },
      ),
  );
