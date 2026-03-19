import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";

export const authPlugin = (app: Elysia) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET || "",
        exp: "1h",
      }),
    )
    .derive(async ({ jwt, headers }) => {
      const authHeader = headers["authorization"];
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      if (!token) {
        return { user: null };
      }

      const payload = await jwt.verify(token);

      if (!payload) {
        return { user: null };
      }

      return {
        user: payload as Record<string, any>,
      };
    })
    .onBeforeHandle(({ user, set }) => {
      if (!user) {
        set.status = 401;
        return { success: false, message: "Token inválido, expirado ou não fornecido." };
      }
    });

export const protectedRoutes = new Elysia()
  .use(authPlugin)
  .get("/profile", ({ user }) => {
    return {
      message: "Perfil acessado!",
      userId: user!.sub,
      role: user!.role,
      userName: user!.userName,
    };
  });

export const adminMiddleware = (app: Elysia) =>
  app
    .use(authPlugin)
    .onBeforeHandle(({ user, set }) => {
      if (!user || user.role !== "ADMIN") {
        set.status = 403;
        return { success: false, message: "Acesso negado. Apenas administradores podem realizar esta ação." };
      }
    });
