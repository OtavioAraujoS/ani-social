import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log("Dropping public schema...");
  await sql`DROP SCHEMA public CASCADE`;
  console.log("Creating public schema...");
  await sql`CREATE SCHEMA public`;
  console.log("Granting permissions...");
  await sql`GRANT ALL ON SCHEMA public TO postgres`;
  await sql`GRANT ALL ON SCHEMA public TO public`;
  console.log("Done.");
  process.exit(0);
}

main().catch(console.error);
