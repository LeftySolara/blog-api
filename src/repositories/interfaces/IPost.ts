export interface IPost {
  title: string;
  content: string;
  published: boolean;
  publicationDate: Date;
  tags: Array<string>;
}
