import { serve } from "@hono/node-server";
import { Hono } from "hono";
import posts from "./posts";

const app = new Hono();

// Dummy Routes

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

/* eslint-disable @typescript-eslint/no-unsafe-argument */

app.route("/posts", posts);

/* eslint-enable @typescript-eslint/no-unsafe-argument */

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
