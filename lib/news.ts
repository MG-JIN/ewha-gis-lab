import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { BASE_PATH } from "@/lib/site";

const newsDirectory = path.join(process.cwd(), "content/news");

const NEWS_IMAGE_CLASS =
  "w-full rounded-md border border-gray-200 cursor-zoom-in transition-opacity hover:opacity-90";

function wrapNewsImages(rawHtml: string): string {
  return rawHtml.replace(
    /<a href="(\/images\/[^"]+)">\s*<img src="(\/images\/[^"]+)" alt="([^"]*)">\s*<\/a>/g,
    (_match, fullSrc, thumbSrc, alt) =>
      `<a href="${BASE_PATH}${fullSrc}" target="_blank" rel="noopener noreferrer" class="block"><img src="${BASE_PATH}${thumbSrc}" alt="${alt}" loading="lazy" class="${NEWS_IMAGE_CLASS}" /></a>`
  );
}

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
    contentHtml: wrapNewsImages(processedContent.toString()),
  };
}
