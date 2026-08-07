import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Tab from "@/components/ui/Tab";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import { getSectionMeta } from "@/lib/sections";
import type { CurriculumProgram } from "@/lib/curriculum";

function ProgramCard({ program }: { program: CurriculumProgram }) {
  return (
    <Card>
      {program.showTitle !== false ? (
        <p className="curriculum-lead">{program.title}</p>
      ) : null}
      <div
        className="prose prose-gray mt-3 max-w-none"
        dangerouslySetInnerHTML={{ __html: program.contentHtml }}
      />
    </Card>
  );
}

export default function CurriculumSection({
  programs,
}: {
  programs: CurriculumProgram[];
}) {
  const { index, label, variant } = getSectionMeta("curriculum");
  const undergraduate = programs.find((program) => program.slug === "undergraduate");
  const graduate = programs.find((program) => program.slug === "graduate");
  // slug가 undergraduate/graduate가 아닌 프로그램이 추가될 경우를 대비한 안전망
  const others = programs.filter(
    (program) => program.slug !== "undergraduate" && program.slug !== "graduate"
  );

  return (
    <Section id="curriculum" variant={variant}>
      <Reveal>
        <SectionHeader index={index} title={label} />
      </Reveal>
      <Reveal delayMs={80}>
        <Tab
          tabs={[
            {
              label: "Undergraduate",
              content: undergraduate ? (
                <ProgramCard program={undergraduate} />
              ) : (
                <p className="text-sm text-gray-500">등록된 학부 교육과정이 없습니다.</p>
              ),
            },
            {
              label: "Graduate",
              content: graduate ? (
                <ProgramCard program={graduate} />
              ) : (
                <p className="text-sm text-gray-500">등록된 대학원 교육과정이 없습니다.</p>
              ),
            },
          ]}
        />
        {others.length > 0 ? (
          <div className="mt-6 space-y-6">
            {others.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        ) : null}
      </Reveal>
    </Section>
  );
}
