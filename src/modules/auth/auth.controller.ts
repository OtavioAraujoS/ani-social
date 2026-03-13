import Elysia, { t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthService } from "./auth.service";

const jwtSetup = jwt({
  name: "jwt",
  secret: process.env.JWT_SECRET || "",
});

export const authController = new Elysia({ prefix: "/auth" })
  .use(jwtSetup)

  .post(
    "/login",
    async ({ body, jwt, set }) => {
      try {
        const user = await AuthService.validateUser(
          body.userName,
          body.password,
        );
        const token = await jwt.sign({
          sub: user.id,
          role: user.role,
          userName: user.userName,
          userId: user.id,
          createdAt: user.createdAt,
        });

        return {
          message: "Login realizado com sucesso",
          token,
        };
      } catch (error: any) {
        set.status = 401;
        return { message: error.message };
      }
    },
    {
      body: t.Object({
        userName: t.String(),
        password: t.String(),
      }),
    },
  );
