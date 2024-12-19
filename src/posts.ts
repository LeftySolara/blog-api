import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import db from "./db";
import { postsTable, postsTagsTable, tagsTable } from "./db/schema";

const CreatePostRequestSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    published: z.boolean(),
    publicationDate: z.string().date(),
    tags: z.array(z.string()),
  })
  .partial({ publicationDate: true, tags: true });

type CreatePostRequestBody = z.infer<typeof CreatePostRequestSchema>;

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
    const reqBody: CreatePostRequestBody = await c.req.json();

    try {
      const createdPost = await db
        .insert(postsTable)
        .values(reqBody)
        .returning({ id: postsTable.id });

      const postId = createdPost[0].id;

      // Add tags to database if they don't exist
      if (reqBody["tags"]) {
        await db.transaction(async (tx) => {
          for (const tag of reqBody["tags"] as Array<string>) {
            const existingTags = await tx
              .select()
              .from(tagsTable)
              .where(eq(tagsTable.title, tag));

            let tagId: number;
            if (existingTags.length === 0) {
              // Create the tag if it doesn't exist.
              const createdTag = await tx
                .insert(tagsTable)
                .values({ title: tag })
                .returning({ id: tagsTable.id });

              tagId = createdTag[0].id;
            } else {
              tagId = existingTags[0].id;
            }

            // Associate the tag with the post.
            await tx.insert(postsTagsTable).values({ postId, tagId });
          }
        });
      }
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
