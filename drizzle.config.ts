import type { Config } from "drizzle-kit";

export default {
  schema: "./app/db/schema/*",
  out: "./app/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:app/db/sqlite.db",
  },
  verbose: true,
  strict: true,
} satisfies Config;
