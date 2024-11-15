import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "@teal/db/connect";
import { getAuthRouter, loginGet } from "./auth/router";
import pino from "pino";
import { EnvWithCtx, setupContext } from "./ctx";
import { env } from "./lib/env";

const logger = pino({ name: "server start" });

const app = new Hono<EnvWithCtx>();

app.use((c, next) => setupContext(c, db, logger, next));

app.get("/", (c) => c.text("Hono meets Node.js"));

app.get("/info", async (c) => {
  const result = await db.query.status.findFirst().execute();
  console.log("result", result);
  return c.json(result);
});

app.route("/oauth", getAuthRouter());

const run = async () => {
  logger.info("Running in " + navigator.userAgent);
  if (navigator.userAgent.includes("Node")) {
    serve(
      {
        fetch: app.fetch,
        port: env.PORT,
        hostname: env.HOST,
      },
      (info) => {
        logger.info(
          `Listening on ${info.address == "::1" ? "http://localhost" : info.address}:${info.port} (${info.family})`,
        );
      },
    );
  }
};

run();

export default app;
