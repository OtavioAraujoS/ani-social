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
import { SuccessInterface } from "../../interfaces/Success";

export const UserService = {
  verifyUserExist: async (userId: string): Promise<boolean> => {
    try {
      const findUser = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!findUser || findUser.length === 0) {
        return false;
      }

      return true;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Usuário não encontrado ou não autorizado."
      ) {
        throw error;
      }
      throw new Error("Não foi possível verificar o usuário.", {
        cause: error,
      });
    }
  },

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

  update: async (
    data: UpdateUserInterface,
  ): Promise<SuccessInterface | void> => {
    try {
      const response = await UserService.verifyUserExist(data.userId);

      if (response) {
        await db.update(users).set(data).where(eq(users.id, data.userId));
        return {
          message: "Usuário atualizado com sucesso!",
          success: true,
          code: 200,
        };
      }
      throw new Error("Usuário não encontrado ou não autorizado.", {
        cause: "Usuário não encontrado ou não autorizado.",
      });
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possível atualizar o usuário.", {
        cause: error,
      });
    }
  },

  updatePassword: async ({
    userId,
    password,
  }: UpdateUserPasswordInterface): Promise<SuccessInterface | void> => {
    try {
      const response = await UserService.verifyUserExist(userId);

      if (response) {
        const hashedPassword = await AuthService.hashPassword(password);
        await db
          .update(users)
          .set({ password: hashedPassword })
          .where(eq(users.id, userId));
        return {
          message: "Senha atualizada com sucesso!",
          success: true,
          code: 200,
        };
      }
      throw new Error("Usuário não encontrado ou não autorizado.", {
        cause: "Usuário não encontrado ou não autorizado.",
      });
    } catch (error) {
      throw new Error("Não foi possível atualizar a senha do usuário.", {
        cause: error,
      });
    }
  },

  updateUserAvatar: async ({
    userId,
    imageBase64Path,
  }: UpdateUserAvatarInterface) => {
    try {
      const response = await UserService.verifyUserExist(userId);

      if (response) {
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
      }

      throw new Error("Usuário não encontrado ou não autorizado.", {
        cause: "Usuário não encontrado ou não autorizado.",
      });
    } catch (error) {
      throw new Error("Não foi possível atualizar o avatar.", {
        cause: error,
      });
    }
  },

  delete: async ({
    userId,
  }: DeleteUserInterface): Promise<SuccessInterface | void> => {
    try {
      const response = await UserService.verifyUserExist(userId);

      if (response) {
        throw new Error("Usuário não encontrado ou não autorizado.", {
          cause: "Usuário não encontrado ou não autorizado.",
        });
      }

      await db.delete(users).where(eq(users.id, userId));
      return {
        message: "Usuário deletado com sucesso!",
        success: true,
        code: 200,
      };
    } catch (error) {
      throw new Error("Não foi possível remover o usuário.", {
        cause: error,
      });
    }
  },
};
