import PageHeading from "@/components/ui/PageHeading";
import PublicationsExplorer from "@/components/publications/PublicationsExplorer";
import { getPublications } from "@/lib/publications";

export default function PublicationsPage() {
  const publications = getPublications();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="Publications"
        description="공간정보연구실의 연도별 논문 및 학술 실적입니다."
      />

      <PublicationsExplorer publications={publications} />
    </div>
  );
}
