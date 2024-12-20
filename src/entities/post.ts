import type { IPost } from "../repositories/interfaces/IPost";

class Post implements IPost {
  title: string;
  content: string;
  published: boolean;
  publicationDate?: string | undefined;
  tags?: string[] | undefined;

  constructor(postData: IPost) {
    this.title = postData.title;
    this.content = postData.content;
    this.published = postData.published;
    this.publicationDate = postData.publicationDate;
    this.tags = postData.tags;
  }
}

export default Post;
