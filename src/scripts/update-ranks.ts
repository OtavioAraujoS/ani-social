import { db } from "../db";
import { users } from "../db/schema";
import { UserService } from "../modules/users/users.service";

async function run() {
  console.log("Iniciando atualização de ranks...");
  const allUsers = await db.select({ id: users.id }).from(users);

  for (const user of allUsers) {
    console.log(`Sincronizando rank para o usuário: ${user.id}`);
    await UserService.syncUserRank(user.id);
  }

  console.log("Atualização concluída!");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
