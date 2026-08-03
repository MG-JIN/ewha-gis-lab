import Link from "next/link";
import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";
import { getNewsList } from "@/lib/news";

const CATEGORY_BADGE_CLASS: Record<string, string> = {
  공지사항: "bg-ewha-coral text-ewha-green-900",
  소식: "bg-ewha-blue text-ewha-green-900",
};

export default function NewsPage() {
  const newsList = getNewsList();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading title="News" description="공간정보연구실의 공지사항입니다." />

      <div className="space-y-4">
        {newsList.map((post) => (
          <Link key={post.slug} href={`/news/${post.slug}`}>
            <Card>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{post.date}</span>
                {post.category ? (
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      CATEGORY_BADGE_CLASS[post.category] ??
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {post.category}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 font-medium text-gray-900">{post.title}</p>
              {post.excerpt ? (
                <p className="mt-2 text-sm text-gray-500">{post.excerpt}</p>
              ) : null}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
