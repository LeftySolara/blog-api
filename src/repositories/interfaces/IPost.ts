export interface IPost {
  title: string;
  content: string;
  published: boolean;
  publicationDate?: string | undefined;
  tags?: Array<string> | undefined;
}
