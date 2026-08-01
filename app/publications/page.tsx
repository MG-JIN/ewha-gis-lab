import PageHeading from "@/components/ui/PageHeading";
import { getPublicationsByYear } from "@/lib/publications";

const TYPE_LABEL: Record<string, string> = {
  journal: "Journal",
  conference: "Conference",
};

export default function PublicationsPage() {
  const publicationsByYear = getPublicationsByYear();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="Publications"
        description="공간정보연구실의 연도별 논문 및 학술 실적입니다."
      />

      <div className="space-y-10">
        {publicationsByYear.map(([year, publications]) => (
          <section key={year}>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">{year}</h2>
            <ul className="space-y-4">
              {publications.map((pub) => (
                <li
                  key={pub.id}
                  className="border-b border-gray-100 pb-4 last:border-none"
                >
                  <p className="font-medium text-gray-900">{pub.title}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {pub.authors} · {pub.venue}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {TYPE_LABEL[pub.type]}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
