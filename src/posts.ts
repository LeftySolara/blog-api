import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import db from "./db";
import { postsTable } from "./db/schema";

const CreatePostRequestSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    published: z.boolean(),
    publicationDate: z.string().date(),
  })
  .partial({ publicationDate: true });

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

// TODO: add ability to include tags in request
app.post(
  "/",
  zValidator("json", CreatePostRequestSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          ok: false,
          message: `${result.error.issues[0]["path"][0]}: ${result.error.issues[0]["message"]}`,
        },
        400,
      );
    }
  }),
  async (c) => {
    const reqBody = await c.req.json();

    try {
      await db.insert(postsTable).values(reqBody);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error creating post.";

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
  },
);

app.patch("/:id", (c) => c.text(`Post ${c.req.param("id")} updated!`));

app.delete("/:id", (c) => c.text(`Post ${c.req.param("id")} deleted!`));

export default app;
