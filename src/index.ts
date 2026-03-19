import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { userController } from "./modules/users/users.controller";
import { authController } from "./modules/auth/auth.controller";

const app = new Elysia()
  .use(swagger({ path: "/docs" }))
  .get("/", ({ redirect }) => {
    return redirect("/docs");
  })
  .group("/api", (app) => app.use(userController).use(authController))

  .listen(3333);

console.log(
  `🚀 Server running at http://${app.server?.hostname}:${app.server?.port}`,
);
