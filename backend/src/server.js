import http from "node:http";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { attachSocket } from "./realtime/socket.js";

async function main() {
  await connectDB();
  const app = createApp();
  const server = http.createServer(app);
  const io = attachSocket(server);
  app.set("io", io);

  server.listen(env.port, () => {
    console.log(`[server] http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
