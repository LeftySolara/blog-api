import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    ok: true,
    message: "This route returns a list of blog posts.",
  });
});

app.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`This route returns the blog post with ID ${id}.`);
});

app.post("/", (c) => c.text("This route creates a new post."));

app.patch("/:id", (c) => c.text(`Post ${c.req.param("id")} updated!`));

app.delete("/:id", (c) => c.text(`Post ${c.req.param("id")} deleted!`));

export default app;
