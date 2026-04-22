import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { UserController } from "./modules/users/users.controller";
import { authController } from "./modules/auth/auth.controller";
import { AnimeController } from "./modules/animes/animes.controller";
import { TopicController } from "./modules/topics/topics.controller";
import { CommentsController } from "./modules/comments/comments.controller";
import { DashboardController } from "./modules/dashboard/dashboard.controller";
import { rateLimit } from "elysia-rate-limit";
import { cors } from "@elysiajs/cors";
import { PaginationQuerySchema } from "./interfaces/Pagination";
import { SuccessResponseSchema } from "./interfaces/Success";

const app = new Elysia()
  .use(cors())
  .model({
    PaginationQuery: PaginationQuerySchema,
    SuccessResponse: SuccessResponseSchema,
  })
  .onAfterHandle(({ set }) => {
    set.headers["X-Content-Type-Options"] = "nosniff";
    set.headers["X-Frame-Options"] = "DENY";
    set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
  })
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 422;

      return {
        type: "validation",
        errors: error.all.map((e) => ({
          path: e.path,
          message: e.message,
          value: e.value,
        })),
      };
    }

    if (error instanceof Error) {
      set.status = 400;
      return {
        success: false,
        message: error.message,
      };
    }
  })
  .use(swagger({ path: "/docs" }))
  .get("/", ({ redirect }) => {
    return redirect("/docs");
  })
  .use(
    rateLimit({
      duration: 60000,
      max: 100,
      generator: (req) => req.headers.get("x-forwarded-for") || "localhost",
    }),
  )
  .group("/auth", (app) => app.use(authController))
  .group("/users", (app) => app.use(UserController))
  .group("/social", (app) =>
    app.use(AnimeController).use(TopicController).use(CommentsController),
  )
  .group("/dashboard", (app) => app.use(DashboardController))
  .listen(3333);

console.log(
  `🚀 Server running at http://${app.server?.hostname}:${app.server?.port}`,
);
