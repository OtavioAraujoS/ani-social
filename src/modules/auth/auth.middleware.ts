import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";

export const authPlugin = (app: Elysia) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET || "",
      }),
    )
    .derive(async ({ jwt, headers, set }) => {
      const authHeader = headers["authorization"];
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      if (!token) {
        set.status = 401;
        throw new Error("Token não fornecido");
      }

      const payload = await jwt.verify(token);

      if (!payload) {
        set.status = 401;
        throw new Error("Token inválido ou expirado");
      }

      return {
        user: payload as Record<string, any>,
      };
    });

export const protectedRoutes = new Elysia()
  .use(authPlugin)
  .get("/profile", ({ user }) => {
    return {
      message: "Perfil acessado!",
      userId: user.sub,
      role: user.role,
      userName: user.userName,
    };
  });

export const adminMiddleware = new Elysia()
  .use(authPlugin)
  .onBeforeHandle(({ user, set }) => {
    if (user.role !== "ADMIN") {
      set.status = 403;
      throw new Error(
        "Acesso negado. Apenas administradores podem realizar esta ação.",
      );
    }
  });
