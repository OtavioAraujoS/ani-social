import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { CreateUserInterface, DeleteUserInterface, UpdateUserInterface } from "../../interfaces/User";

export const UserService = {
  findAll: async () => {
    return await db.select().from(users);
  },

  create: async (data: CreateUserInterface) => {
    const [newUser] = await db.insert(users).values(data).returning();
    return newUser;
  },

  update: async (data: UpdateUserInterface) => {
    await db.update(users).set(data).where(eq(users.id, data.id));
  },

  delete: async ( data: DeleteUserInterface) => {
    await db.delete(users).where(eq(users.id, data.id));
  }
};
