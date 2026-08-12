import { defineConfig } from "prisma/config";
import {config} from "./src/config.js";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // @ts-expect-error
    url: config.DATABASE_URL,
  },
});
