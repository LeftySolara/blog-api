import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

// TODO: Write a SQL trigger that sets publicationDate to NULL when published is set to false.
export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 512 }).notNull(),
  content: text().notNull(),
  published: boolean().notNull().default(false),
  publicationDate: date(),
});

// TODO: implement tags
