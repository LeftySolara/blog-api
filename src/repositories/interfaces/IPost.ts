export interface IPost {
  title: string;
  content: string;
  published: boolean;
  publicationDate?: string | null | undefined;
  tags?: Array<string> | undefined;
}
