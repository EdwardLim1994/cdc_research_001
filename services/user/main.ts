import { Elysia } from "elysia";
import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "app",
  password: "app",
  database: "appdb",
});

const app = new Elysia()
  .post("/user", async ({ body }) => {
    const { name, email } = body as { name: string; email: string };
    const [result] = await db.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email],
    );
    return { success: true, result };
  })
  .patch("/user/:id", async ({ params: { id }, body }) => {
    const { name, email } = body as { name: string; email: string };

    const [result] = await db.execute(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id],
    );

    return { success: true, result };
  })
  .delete("/user/:id", async ({ params: { id } }) => {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);

    return { success: true, result };
  })
  .get("/", () => ({ hello: "Bun👋" }))
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
