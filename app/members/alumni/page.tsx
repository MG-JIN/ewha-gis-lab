import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";
import { getAlumniByDegree, type Member } from "@/lib/members";

const GROUPS: { degree: "phd" | "ms"; label: string }[] = [
  { degree: "phd", label: "PhD" },
  { degree: "ms", label: "MS" },
];

function AlumniParagraph({ member }: { member: Member }) {
  const degreeLabel = member.degree === "phd" ? "박사" : "석사";

  return (
    <p className="text-sm leading-relaxed text-gray-600">
      <span className="font-medium text-gray-900">{member.name}</span>,{" "}
      {member.gradYear}년 {degreeLabel} 졸업. 학위논문은 「{member.thesis}」이다.
      {member.affiliation ? ` 현재 ${member.affiliation}에 재직 중이다.` : ""}
    </p>
  );
}

export default function AlumniPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="Alumni"
        description="공간정보연구실을 졸업한 구성원을 소개합니다."
      />

      {GROUPS.map(({ degree, label }) => {
        const members = getAlumniByDegree(degree);
        if (members.length === 0) return null;

        return (
          <section key={degree} className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-ewha-green-900">{label}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {members.map((member) => (
                <Card key={member.id}>
                  <AlumniParagraph member={member} />
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
