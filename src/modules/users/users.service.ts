import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import {
  CreateUserInterface,
  DeleteUserInterface,
  UpdateUserInterface,
  UpdateUserPasswordInterface,
} from "../../interfaces/User";
import { AuthService } from "../auth/auth.service";

export const UserService = {
  findAll: async () => {
    return await db.select().from(users);
  },

  create: async (data: CreateUserInterface) => {
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

  update: async (data: UpdateUserInterface) => {
    await db.update(users).set(data).where(eq(users.id, data.id));
  },

  updatePassword: async ({ id, password }: UpdateUserPasswordInterface) => {
    const hashedPassword = await AuthService.hashPassword(password);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id));
  },

  delete: async (data: DeleteUserInterface) => {
    await db.delete(users).where(eq(users.id, data.id));
  },
};
