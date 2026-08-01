import Link from "next/link";
import { getNewsList } from "@/lib/news";
import { getPublications } from "@/lib/publications";
import { getProjects } from "@/lib/projects";
import Card from "@/components/ui/Card";

export default function Home() {
  const recentNews = getNewsList().slice(0, 3);
  const recentPublications = getPublications().slice(0, 3);
  const ongoingProjects = getProjects().filter((p) => p.status === "ongoing");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Ewha GIS Lab
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          이화여자대학교 공간정보연구실은 공간정보시스템(GIS), 원격탐사, 도시·교통
          공간분석을 중심으로 공간 데이터를 활용한 사회 문제 해결 연구를 수행합니다.
        </p>
        <Link
          href="/about"
          className="mt-6 inline-block rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          About Us
        </Link>
      </section>

      <section className="mt-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">News</h2>
          <Link href="/news" className="text-sm text-gray-500 hover:text-gray-900">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {recentNews.map((post) => (
            <Link key={post.slug} href={`/news/${post.slug}`}>
              <Card>
                <p className="text-xs text-gray-400">{post.date}</p>
                <p className="mt-2 font-medium text-gray-900">{post.title}</p>
                {post.excerpt ? (
                  <p className="mt-2 text-sm text-gray-500">{post.excerpt}</p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 sm:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Ongoing Projects
            </h2>
            <Link
              href="/projects"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {ongoingProjects.map((project) => (
              <li key={project.id} className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{project.title}</span>
                <span className="block text-gray-500">{project.funder}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Publications
            </h2>
            <Link
              href="/publications"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {recentPublications.map((pub) => (
              <li key={pub.id} className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{pub.title}</span>
                <span className="block text-gray-500">
                  {pub.authors} · {pub.venue} ({pub.year})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
