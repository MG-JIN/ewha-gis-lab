import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";
import { getCurriculumPrograms } from "@/lib/curriculum";

export default async function CurriculumPage() {
  const programs = await getCurriculumPrograms();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="Curriculum"
        description="공간정보연구실의 학부·대학원 교육과정을 소개합니다."
      />

      <div className="space-y-6">
        {programs.map((program) => (
          <Card key={program.slug}>
            {program.showTitle !== false ? (
              <p className="curriculum-lead">{program.title}</p>
            ) : null}
            <div
              className="prose prose-gray mt-3 max-w-none"
              dangerouslySetInnerHTML={{ __html: program.contentHtml }}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
