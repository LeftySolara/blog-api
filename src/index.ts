import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

// Dummy Routes

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/posts", (c) => {
  return c.json({
    ok: true,
    message: "This route returns a list of blog posts.",
  });
});

app.get("/posts/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`This route returns the blog post with ID ${id}.`);
});

app.post("/posts", (c) => c.text("This route creates a new blog post.", 201));

app.delete("/posts/:id", (c) => c.text(`Post ${c.req.param("id")} deleted!`));

app.patch("/posts/:id", (c) => c.text(`Post ${c.req.param("id")} updated!`));

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
