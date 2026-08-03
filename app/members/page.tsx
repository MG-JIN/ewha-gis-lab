import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";
import { getMembersByCategory, type MemberCategory } from "@/lib/members";

const GROUPS: { category: MemberCategory; label: string }[] = [
  { category: "faculty", label: "Faculty" },
  { category: "phd", label: "PhD" },
  { category: "combined-ms-phd", label: "Combined MS/PhD" },
  { category: "ms", label: "MS" },
  { category: "combined-bs-ms", label: "Combined BS/MS" },
];

export default function MembersPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="Current Members"
        description="공간정보연구실 구성원을 소개합니다."
      />

      {GROUPS.map(({ category, label }) => {
        const members = getMembersByCategory(category);
        if (members.length === 0) return null;

        return (
          <section key={category} className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-ewha-green-900">{label}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {members.map((member) => (
                <Card key={member.id}>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                  {member.interests && member.interests.length > 0 ? (
                    <p className="mt-3 text-sm text-gray-600">
                      관심분야: {member.interests.join(", ")}
                    </p>
                  ) : null}
                  {member.email ? (
                    <p className="mt-1 text-sm text-gray-500">{member.email}</p>
                  ) : null}
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
