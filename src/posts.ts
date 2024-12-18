import { Hono } from "hono";
import db from "./db";
import { postsTable } from "./db/schema";

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

// TODO: add request validation
// TODO: add ability to include tags in request
app.post("/", async (c) => {
  const {
    title,
    content,
    published,
    publicationDate,
  }: {
    title: string;
    content: string;
    published: boolean;
    publicationDate: string;
  } = await c.req.json();

  const postValues = {
    title,
    content,
    published,
    publicationDate,
  };

  try {
    await db.insert(postsTable).values(postValues);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating post.";

    return c.json(
      {
        ok: false,
        message,
      },
      500,
    );
  }

  return c.json(
    {
      ok: true,
      message: "Post created.",
    },
    201,
  );
});

app.patch("/:id", (c) => c.text(`Post ${c.req.param("id")} updated!`));

app.delete("/:id", (c) => c.text(`Post ${c.req.param("id")} deleted!`));

export default app;
