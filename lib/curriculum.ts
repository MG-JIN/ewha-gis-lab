import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { BASE_PATH } from "@/lib/site";

const curriculumDirectory = path.join(process.cwd(), "content/curriculum");

const CURRICULUM_IMAGE_CLASS =
  "w-full rounded-md border border-gray-200 cursor-zoom-in transition-opacity hover:opacity-90";

export interface CurriculumProgram {
  slug: string;
  title: string;
  order: number;
  showTitle: boolean;
  contentHtml: string;
}

function wrapTablesAndExternalLinks(rawHtml: string): string {
  return rawHtml
    .replace(/<table>/g, '<div class="overflow-x-auto"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(
      /<a href="http:\/\/www\.spacen\.or\.kr\/main\.do">/g,
      '<a href="http://www.spacen.or.kr/main.do" target="_blank" rel="noopener noreferrer">'
    )
    .replace(
      '<a href="/images/track1.png" target="_blank" rel="noopener noreferrer">',
      `<a href="${BASE_PATH}/images/track1-full.png" target="_blank" rel="noopener noreferrer" class="block">`
    )
    .replace(
      '<a href="/images/track2.png" target="_blank" rel="noopener noreferrer">',
      `<a href="${BASE_PATH}/images/track2-full.png" target="_blank" rel="noopener noreferrer" class="mt-4 block">`
    )
    .replace(
      /<img src="\/images\/track1\.png" alt="([^"]*)" \/>/,
      `<img src="${BASE_PATH}/images/track1-thumb.webp" alt="$1" loading="lazy" class="${CURRICULUM_IMAGE_CLASS}" />`
    )
    .replace(
      /<img src="\/images\/track2\.png" alt="([^"]*)" \/>/,
      `<img src="${BASE_PATH}/images/track2-thumb.webp" alt="$1" loading="lazy" class="${CURRICULUM_IMAGE_CLASS}" />`
    );
}

export async function getCurriculumPrograms(): Promise<CurriculumProgram[]> {
  const files = fs
    .readdirSync(curriculumDirectory)
    .filter((file) => file.endsWith(".md"));

  const programs = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.md$/, "");
      const fileContents = fs.readFileSync(
        path.join(curriculumDirectory, file),
        "utf8"
      );
      const { data, content } = matter(fileContents);
      const processedContent = await remark()
        .use(remarkGfm)
        .use(html, { sanitize: false })
        .process(content);

      return {
        slug,
        title: data.title as string,
        order: (data.order as number) ?? 0,
        showTitle: (data.showTitle as boolean) ?? true,
        contentHtml: wrapTablesAndExternalLinks(processedContent.toString()),
      };
    })
  );

  return programs.sort((a, b) => a.order - b.order);
}
