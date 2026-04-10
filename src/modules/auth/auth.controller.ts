import Elysia, { t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthService } from "./auth.service";
import { LoginSchema, LoginResponseSchema } from "../../interfaces/Auth";

const jwtSetup = jwt({
  name: "jwt",
  secret: process.env.JWT_SECRET || "",
  exp: "1h",
});

export const authController = new Elysia()
  .use(jwtSetup)
  .model({
    Login: LoginSchema,
    LoginResponse: LoginResponseSchema,
  })
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
          createdAt: user.createdAt.toISOString(),
          avatar: user.avatarUrl,
          rank: user.rank,
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
      body: "Login",
      response: {
        200: "LoginResponse",
        401: t.Object({
          message: t.String(),
        }),
      },
    },
  );
