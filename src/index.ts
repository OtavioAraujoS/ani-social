import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { UserController } from "./modules/users/users.controller";
import { authController } from "./modules/auth/auth.controller";
import { AnimeController } from "./modules/animes/animes.controller";
import { TopicController } from "./modules/topics/topics.controller";
import { CommentsController } from "./modules/comments/comments.controller";
import { rateLimit } from "elysia-rate-limit";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .onAfterHandle(({ set }) => {
    set.headers["X-Content-Type-Options"] = "nosniff";
    set.headers["X-Frame-Options"] = "DENY";
    set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
  })
  .use(swagger({ path: "/docs" }))
  .get("/", ({ redirect }) => {
    return redirect("/docs");
  })
  .group("/api", (app) =>
    app
      .use(rateLimit({ 
        duration: 60000, 
        max: 100,
        generator: (req) => req.headers.get("x-forwarded-for") || "localhost" 
      }))
      .use(authController)
      .use(UserController)
      .use(AnimeController)
      .use(TopicController)
      .use(CommentsController),
  )
  .listen(3333);

console.log(
  `🚀 Server running at http://${app.server?.hostname}:${app.server?.port}`,
);
