import { serve } from "@hono/node-server";
import { Hono } from "hono";
import logger from "@utils/logger";
import posts from "./posts";

const app = new Hono();

// Dummy Routes

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/posts", posts);

const port = 3000;
logger.info(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
