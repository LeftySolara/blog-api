CREATE TABLE "PostsTags" (
	"post_id" integer NOT NULL,
	"tag_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(64) NOT NULL,
	CONSTRAINT "Tags_title_unique" UNIQUE("title")
);
--> statement-breakpoint
ALTER TABLE "PostsTags" ADD CONSTRAINT "PostsTags_post_id_Posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."Posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PostsTags" ADD CONSTRAINT "PostsTags_tag_id_Tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."Tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "post_id_tag_id" ON "PostsTags" USING btree ("post_id","tag_id");--> statement-breakpoint
CREATE INDEX "tag_id" ON "PostsTags" USING btree ("tag_id");