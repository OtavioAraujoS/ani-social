import { Elysia } from "elysia";
import { userController } from "./modules/users/users.controller";
import { authController } from "./modules/auth/auth.controller";

const app = new Elysia()
  .get("/", () => "Bem-vindo à minha API do Ani-Social!")

  .group("/api", (app) => app.use(userController).use(authController))

  .listen(3333);

console.log(
  `🚀 Server running at http://${app.server?.hostname}:${app.server?.port}`,
);
