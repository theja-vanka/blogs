export interface PostHeading {
  level: number;
  text: string;
  id: string;
}

export interface PostMeta {
  slug: string[];
  slugPath: string;
  title: string;
  author: string;
  date: string;
  description: string;
  categories: string[];
  readingTime: number;
  wordCount: number;
  coverImage?: string;
  featured?: boolean;
}

export interface Post extends PostMeta {
  content: string;
  headings: PostHeading[];
  hasMermaid: boolean;
  hasMath: boolean;
}
