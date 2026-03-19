import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { UserController } from "./modules/users/users.controller";
import { authController } from "./modules/auth/auth.controller";
import { AnimeController } from "./modules/animes/animes.controller";

const app = new Elysia()
  .use(swagger({ path: "/docs" }))
  .get("/", ({ redirect }) => {
    return redirect("/docs");
  })
  .group("/api", (app) =>
    app.use(authController).use(UserController).use(AnimeController),
  )

  .listen(3333);

console.log(
  `🚀 Server running at http://${app.server?.hostname}:${app.server?.port}`,
);
