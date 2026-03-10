import { Elysia } from "elysia";
import { userController } from "./modules/users/users.controller";

const app = new Elysia()
  .get("/", () => "Bem-vindo à minha API do Ani-Social!")

  .group("/api", (app) => app.use(userController))

  .listen(3000);

console.log(
  `🚀 Server running at http://${app.server?.hostname}:${app.server?.port}`,
);
