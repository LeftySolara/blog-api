import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import db from "./db";
import PostRepository from "@repositories/postRepository";
import AppError from "@utils/appError/appError";
import commonErrors from "@utils/appError/commonErrors";
import { commonHTTPErrors } from "@utils/appError/commonHTTPErrors";
import type { StatusCode } from "hono/utils/http-status";

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

app.get("/", async (c) => {
  try {
    const postRepo = new PostRepository(db);
    const posts = await postRepo.find();

    return c.json({
      ok: true,
      posts,
    });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return c.json(
        {
          ok: false,
          message: err.message,
        },
        err.httpCode as StatusCode,
      );
    } else {
      return c.json({
        ok: false,
        message: "Unknown error.",
      });
    }
  }
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
    const postRepo = new PostRepository(db);

    try {
      const result = await postRepo.create(reqBody);
      if (!result) {
        throw new AppError(
          commonErrors.internalServerError,
          commonHTTPErrors.internalServerError,
          "Error creating post.",
          false,
        );
      }
    } catch (err: unknown) {
      if (err instanceof AppError) {
        return c.json(
          {
            ok: false,
            message: err.message,
          },
          err.httpCode as StatusCode,
        );
      }
    }

    return c.json(
      {
        ok: true,
        message: "Post created.",
      },
      commonHTTPErrors.created as StatusCode,
    );
  },
);

app.patch("/:id", (c) => c.text(`Post ${c.req.param("id")} updated!`));

app.delete("/:id", (c) => c.text(`Post ${c.req.param("id")} deleted!`));

export default app;
