import PageHeading from "@/components/ui/PageHeading";
import NewsExplorer from "@/components/news/NewsExplorer";
import { getNewsList } from "@/lib/news";

export default function NewsPage() {
  const newsList = getNewsList();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading title="News" description="공간정보연구실의 공지사항입니다." />

      <NewsExplorer newsList={newsList} />
    </div>
  );
}
