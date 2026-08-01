import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const newsDirectory = path.join(process.cwd(), "content/news");

export interface NewsSummary {
  slug: string;
  title: string;
  date: string;
  category?: string;
  excerpt?: string;
}

export interface NewsPost extends NewsSummary {
  contentHtml: string;
}

export function getAllNewsSlugs(): string[] {
  return fs
    .readdirSync(newsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getNewsList(): NewsSummary[] {
  const slugs = getAllNewsSlugs();
  const posts = slugs.map((slug) => {
    const fileContents = fs.readFileSync(
      path.join(newsDirectory, `${slug}.md`),
      "utf8"
    );
    const { data } = matter(fileContents);
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      category: data.category as string | undefined,
      excerpt: data.excerpt as string | undefined,
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getNewsBySlug(slug: string): Promise<NewsPost> {
  const fileContents = fs.readFileSync(
    path.join(newsDirectory, `${slug}.md`),
    "utf8"
  );
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    category: data.category as string | undefined,
    excerpt: data.excerpt as string | undefined,
    contentHtml: processedContent.toString(),
  };
}
