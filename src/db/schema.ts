import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// TODO: Write a SQL trigger that sets publicationDate to NULL when published is set to false.
export const postsTable = pgTable("Posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 512 }).notNull(),
  content: text().notNull(),
  published: boolean().notNull().default(false),
  publicationDate: date(),
});

export const tagsTable = pgTable("Tags", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 64 }).notNull().unique(),
});

// Connect tags to posts.
export const postsTagsTable = pgTable(
  "PostsTags",
  {
    postId: integer("post_id")
      .references(() => postsTable.id)
      .notNull(),
    tagId: integer("tag_id")
      .references(() => tagsTable.id)
      .notNull(),
  },
  (table) => [
    uniqueIndex("post_id_tag_id").on(table.postId, table.tagId),
    index("tag_id").on(table.tagId),
  ],
);
