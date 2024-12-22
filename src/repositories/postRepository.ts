import { eq } from "drizzle-orm";
import { postsTable, postsTagsTable, tagsTable } from "@db/schema";
import type Post from "@entities/post";
import BaseRepository from "@repositories/base/baseRepository";
import logger from "@utils/logger";
import AppError from "@utils/appError/appError";
import commonErrors from "@utils/appError/commonErrors";
import { commonHTTPErrors } from "@utils/appError/commonHTTPErrors";

class PostRepository extends BaseRepository<Post> {
  async create(item: Post): Promise<boolean> {
    try {
      const createdPost = await this.db
        .insert(postsTable)
        .values(item)
        .returning({ id: postsTable.id });

      const postId = createdPost[0].id;

      // Add tags to database if they don't exist.
      if (item["tags"]) {
        await this.db.transaction(async (tx) => {
          for (const tag of item["tags"] as Array<string>) {
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
      if (err instanceof Error) {
        logger.error(err.message);
      }
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }

  async find(): Promise<Post[]> {
    try {
      const posts: Post[] = await this.db.select().from(postsTable);
      return await Promise.resolve(posts);
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(err.message);
      }
      throw new AppError(
        commonErrors.internalServerError,
        commonHTTPErrors.internalServerError,
        "Error fetching posts.",
        true,
      );
    }
  }
}

export default PostRepository;
