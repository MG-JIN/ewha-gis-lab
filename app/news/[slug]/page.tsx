import Link from "next/link";
import { getAllNewsSlugs, getNewsBySlug } from "@/lib/news";

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/news" className="text-sm text-gray-500 hover:text-gray-900">
        ← Back to News
      </Link>

      <div className="mt-6 flex items-center gap-3 text-xs text-gray-400">
        <span>{post.date}</span>
        {post.category ? (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
            {post.category}
          </span>
        ) : null}
      </div>

      <h1 className="mt-3 text-2xl font-bold text-gray-900">{post.title}</h1>

      <div
        className="prose prose-gray mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </div>
  );
}
