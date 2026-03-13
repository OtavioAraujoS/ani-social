import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";

export const protectedRoutes = new Elysia()
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
      user: payload,
    };
  })
  .get("/profile", ({ user }) => {
    return {
      message: "Perfil acessado!",
      userId: user.sub,
      role: user.role,
      userName: user.userName,
    };
  });
