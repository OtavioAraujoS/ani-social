import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import {
  CreateUserInterface,
  DeleteUserInterface,
  UpdateUserAvatarInterface,
  UpdateUserInterface,
  UpdateUserPasswordInterface,
} from "../../interfaces/User";
import { AuthService } from "../auth/auth.service";
import cloudinary from "../../lib/cloudinary";

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
    await db.update(users).set(data).where(eq(users.id, data.userId));
  },

  updatePassword: async ({ userId, password }: UpdateUserPasswordInterface) => {
    const hashedPassword = await AuthService.hashPassword(password);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  },

  updateUserAvatar: async ({
    userId,
    imageBase64Path,
  }: UpdateUserAvatarInterface) => {
    try {
      const uploadResult = await cloudinary.uploader.upload(imageBase64Path, {
        folder: "avatars",
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "face" },
        ],
      });
      const avatarUrl = uploadResult.secure_url;
      await db
        .update(users)
        .set({ avatarUrl, updatedAt: new Date() })
        .where(eq(users.id, userId));
      return { message: "Avatar atualizado com sucesso!", avatarUrl };
    } catch (error) {
      console.error("Erro no upload para o Cloudinary", error);
      throw new Error("Não foi possível atualizar o avatar.", {
        cause: error,
      });
    }
  },

  delete: async (data: DeleteUserInterface) => {
    await db.delete(users).where(eq(users.id, data.userId));
  },
};
