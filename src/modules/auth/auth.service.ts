import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export const AuthService = {
  hashPassword: async (password: string) => {
    return await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });
  },

  register: async (data: any) => {
    const hashedPassword = await AuthService.hashPassword(data.password);

    const [newUser] = await db
      .insert(users)
      .values({
        ...data,
        password: hashedPassword,
      })
      .returning();

    return newUser;
  },

  validateUser: async (userName: string, passwordString: string) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.userName, userName));

    if (!user) throw new Error("Usuário não encontrado");

    const isMatch = await Bun.password.verify(passwordString, user.password);

    if (!isMatch) throw new Error("Credenciais inválidas");

    return user;
  },

  userIsTheSameOrAdmin: async (userId: string, userLoggedId: string) => {
    if (userId === userLoggedId) return true;

    const [loggedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userLoggedId));

    if (!loggedUser) throw new Error("Usuário logado não encontrado");

    if (loggedUser.role === "ADMIN") return true;

    throw new Error("Usuário não autorizado");
  },
};
