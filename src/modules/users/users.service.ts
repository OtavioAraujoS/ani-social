import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import {
  CreateUserInterface,
  DeleteUserInterface,
  UpdateUserAvatarInterface,
  UpdateUserInterface,
  UpdateUserPasswordInterface,
  UserResponseInterface,
  UsersListResponseInterface,
} from "../../interfaces/User";
import { AuthService } from "../auth/auth.service";
import { uploadImage } from "../../lib/cloudinary";
import { SuccessResponseInterface } from "../../interfaces/Success";
import xss from "xss";

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

  findAll: async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<UsersListResponseInterface> => {
    try {
      return await db
        .select({
          id: users.id,
          name: users.name,
          userName: users.userName,
          avatarUrl: users.avatarUrl,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .limit(limit)
        .offset((page - 1) * limit);
    } catch (error) {
      throw new Error("Não foi possível listar os usuários - " + error, {
        cause: error,
      });
    }
  },

  findById: async (userId: string): Promise<UserResponseInterface> => {
    try {
      const userExist = await UserService.verifyUserExist(userId);

      if (userExist) {
        const [user] = await db
          .select({
            id: users.id,
            name: users.name,
            userName: users.userName,
            avatarUrl: users.avatarUrl,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          })
          .from(users)
          .where(eq(users.id, userId));

        return user;
      }
      throw new Error("Usuário não encontrado ou não autorizado.", {
        cause: "Usuário não encontrado ou não autorizado.",
      });
    } catch (error) {
      throw new Error("Não foi possível encontrar o usuário - " + error, {
        cause: error,
      });
    }
  },

  create: async (
    data: CreateUserInterface,
  ): Promise<SuccessResponseInterface> => {
    try {
      const hashedPassword = await AuthService.hashPassword(data.password);
      await db
        .insert(users)
        .values({
          name: xss(data.name),
          userName: data.userName,
          password: hashedPassword,
        })
        .returning();
      return {
        message: "Usuário criado com sucesso!",
        success: true,
        code: 201,
      };
    } catch (error) {
      throw new Error("Não foi possível criar o usuário - " + error, {
        cause: error,
      });
    }
  },

  update: async ({
    userId,
    name,
    userName,
    userLoggedId,
  }: UpdateUserInterface & {
    userLoggedId: string;
  }): Promise<SuccessResponseInterface> => {
    try {
      const userExist = await UserService.verifyUserExist(userId);

      if (userExist) {
        const userIsTheSameOrAdmin = await AuthService.userIsTheSameOrAdmin(
          userId,
          userLoggedId,
        );

        if (!userIsTheSameOrAdmin) {
          throw new Error("Usuário não autorizado.");
        }

        const sanitizedName = name ? xss(name) : undefined;
        const sanitizedUserName = userName ? xss(userName) : undefined;

        await db
          .update(users)
          .set({
            name: sanitizedName,
            userName: sanitizedUserName,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
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
      console.error("DIAGNOSTICO UPDATE:", { error, userId, userLoggedId });
      throw new Error("Não foi possível atualizar o usuário - " + error, {
        cause: error,
      });
    }
  },

  updatePassword: async ({
    userId,
    password,
    userLoggedId,
  }: UpdateUserPasswordInterface & {
    userLoggedId: string;
  }): Promise<SuccessResponseInterface> => {
    try {
      const userExist = await UserService.verifyUserExist(userId);

      if (userExist) {
        const userIsTheSameOrAdmin = await AuthService.userIsTheSameOrAdmin(
          userId,
          userLoggedId,
        );

        if (!userIsTheSameOrAdmin) {
          throw new Error("Usuário não autorizado.");
        }

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
      console.error("DIAGNOSTICO PASSWORD:", { error, userId, userLoggedId });
      throw new Error(
        "Não foi possível atualizar a senha do usuário- " + error,
        {
          cause: error,
        },
      );
    }
  },

  updateUserAvatar: async ({
    userId,
    imageBase64Path,
    userLoggedId,
  }: UpdateUserAvatarInterface & {
    userLoggedId: string;
  }): Promise<SuccessResponseInterface> => {
    try {
      const userExist = await UserService.verifyUserExist(userId);

      if (userExist) {
        const userIsTheSameOrAdmin = await AuthService.userIsTheSameOrAdmin(
          userId,
          userLoggedId,
        );

        if (!userIsTheSameOrAdmin) {
          throw new Error("Usuário não autorizado.");
        }

        const avatarUrl = await uploadImage(imageBase64Path, "avatars");
        await db
          .update(users)
          .set({ avatarUrl, updatedAt: new Date() })
          .where(eq(users.id, userId));
        return {
          message: "Avatar atualizado com sucesso!",
          code: 200,
          success: true,
        };
      }
      throw new Error("Usuário não encontrado ou não autorizado.", {
        cause: "Usuário não encontrado ou não autorizado.",
      });
    } catch (error) {
      console.error("DIAGNOSTICO AVATAR:", { error, userId, userLoggedId });
      throw new Error("Não foi possível atualizar o avatar- " + error, {
        cause: error,
      });
    }
  },

  delete: async ({
    userId,
    userLoggedId,
  }: DeleteUserInterface & {
    userLoggedId: string;
  }): Promise<SuccessResponseInterface> => {
    try {
      const userExist = await UserService.verifyUserExist(userId);

      if (userExist) {
        const userIsTheSameOrAdmin = await AuthService.userIsTheSameOrAdmin(
          userId,
          userLoggedId,
        );

        if (!userIsTheSameOrAdmin) {
          throw new Error("Usuário não autorizado.");
        }

        await db.delete(users).where(eq(users.id, userId));
        return {
          message: "Usuário deletado com sucesso!",
          success: true,
          code: 200,
        };
      }

      throw new Error("Usuário não encontrado ou não autorizado.", {
        cause: "Usuário não encontrado ou não autorizado.",
      });
    } catch (error) {
      throw new Error("Não foi possível remover o usuário - " + error, {
        cause: error,
      });
    }
  },
};
