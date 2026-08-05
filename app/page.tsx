import Link from "next/link";
import { getNewsList } from "@/lib/news";
import { getPublications } from "@/lib/publications";
import { getCurrentProjects } from "@/lib/projects";
import Card from "@/components/ui/Card";
import Hero from "@/components/home/Hero";
import LocationSection from "@/components/home/LocationSection";

export default function Home() {
  const recentNews = getNewsList().slice(0, 3);
  const recentPublications = getPublications().slice(0, 3);
  const currentProjects = getCurrentProjects();

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <section className="mt-16">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ewha-green-900">News</h2>
            <Link href="/news" className="text-sm text-gray-500 hover:text-ewha-green-900">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {recentNews.map((post) => (
              <Link key={post.slug} href={`/news/${post.slug}`}>
                <Card className="bg-ewha-pear-blossom">
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
              <h2 className="text-xl font-semibold text-ewha-green-900">
                Current Projects
              </h2>
              <Link
                href="/projects"
                className="text-sm text-gray-500 hover:text-ewha-green-900"
              >
                View all
              </Link>
            </div>
            <ul className="space-y-3">
              {currentProjects.map((project) => (
                <li key={project.id} className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{project.title}</span>
                  <span className="block text-gray-500">{project.funder}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ewha-green-900">
                Recent Publications
              </h2>
              <Link
                href="/publications"
                className="text-sm text-gray-500 hover:text-ewha-green-900"
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

        <LocationSection />
      </div>
    </>
  );
}
