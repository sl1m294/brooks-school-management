import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./database/prisma.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`School Management API listening on port ${env.PORT}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing API server.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

