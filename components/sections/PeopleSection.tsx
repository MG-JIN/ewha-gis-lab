import Image from "next/image";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Tab from "@/components/ui/Tab";
import Reveal from "@/components/ui/Reveal";
import AlumniTable from "@/components/AlumniTable";
import { IconMail } from "@/components/ui/icons";
import { withBasePath } from "@/lib/site";
import { getSectionMeta } from "@/lib/sections";
import type { Member, MemberCategory } from "@/lib/members";

const MEMBER_GROUPS: { category: MemberCategory; label: string }[] = [
  { category: "phd", label: "PhD" },
  { category: "combined-ms-phd", label: "Combined MS/PhD" },
  { category: "ms", label: "MS" },
  { category: "combined-bs-ms", label: "Combined BS/MS" },
];

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400">등록된 정보가 없습니다.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-ewha-green-700" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

// 데이터 순서(최신순)를 그대로 렌더링한다 — 여기서 재정렬하지 않음.
function ExperienceList({
  items,
}: {
  items: { title: string; period: string }[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400">등록된 정보가 없습니다.</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={`${item.title}-${item.period}`} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-ewha-green-700" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-500">{item.period}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ProfessorBlock({ professor }: { professor: Member }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
      <div className="shrink-0">
        {professor.photo ? (
          <Image
            src={withBasePath(`/images/${professor.photo}`)}
            alt={`${professor.name} 교수 사진`}
            width={280}
            height={280}
            className="h-64 w-64 rounded-full object-cover sm:h-72 sm:w-72"
          />
        ) : (
          <div className="flex h-64 w-64 items-center justify-center rounded-full bg-ewha-green-800 text-5xl font-bold text-white sm:h-72 sm:w-72">
            {professor.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="w-full text-center md:text-left">
        <p className="text-sm font-semibold tracking-wide text-ewha-green-700 uppercase">
          Professor
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{professor.name}</p>
        {professor.email ? (
          <p className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500 md:justify-start">
            <IconMail className="h-4 w-4 text-ewha-green-700" />
            {professor.email}
          </p>
        ) : null}

        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
            Education
          </h4>
          <div className="mt-3">
            <BulletList items={professor.education ?? []} />
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
            Experience
          </h4>
          <div className="mt-3">
            <ExperienceList items={professor.experience ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentCard({ member }: { member: Member }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-square w-full bg-ewha-green-50">
        {member.photo ? (
          <Image
            src={withBasePath(`/images/${member.photo}`)}
            alt={`${member.name} 프로필 사진`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-ewha-green-900">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        {member.nameEn ? (
          <>
            <p className="font-semibold text-gray-900">{member.nameEn}</p>
            <p className="text-sm text-gray-500">({member.name})</p>
          </>
        ) : (
          <p className="font-semibold text-gray-900">{member.name}</p>
        )}
        <p className="mt-2 text-xs font-medium text-ewha-green-800">{member.role}</p>
        {member.email ? (
          <p className="mt-1 flex items-center justify-center gap-1 text-xs text-ewha-green-800">
            <IconMail className="h-3.5 w-3.5" />
            {member.email}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function CurrentMembersPanel({
  membersByCategory,
}: {
  membersByCategory: Record<string, Member[]>;
}) {
  return (
    <>
      {MEMBER_GROUPS.map(({ category, label }) => {
        const members = membersByCategory[category] ?? [];
        if (members.length === 0) return null;

        return (
          <section key={category} className="mb-12 last:mb-0">
            <h3 className="mb-4 text-xl font-semibold text-ewha-green-900">{label}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member) => (
                <StudentCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

// content/members.json 확인 결과: 졸업생(alumni) 32명 전원이 photo: "" 상태
// (0/32 사진 보유). 사진 없는 카드를 다수 배치하면 오히려 빈약해 보이므로
// 카드 전환 대신 기존 표(AlumniTable) 형태를 유지한다.
function AlumniPanel({
  phdAlumni,
  msAlumni,
}: {
  phdAlumni: Member[];
  msAlumni: Member[];
}) {
  return (
    <>
      {phdAlumni.length > 0 ? (
        <section className="mb-12">
          <h3 className="mb-4 text-xl font-bold text-ewha-green-900">- 박사 졸업생</h3>
          <AlumniTable degree="phd" members={phdAlumni} />
        </section>
      ) : null}

      {msAlumni.length > 0 ? (
        <section className="mb-12 last:mb-0">
          <h3 className="mb-4 text-xl font-bold text-ewha-green-900">- 석사 졸업생</h3>
          <AlumniTable degree="ms" members={msAlumni} />
        </section>
      ) : null}
    </>
  );
}

export default function PeopleSection({
  faculty,
  membersByCategory,
  phdAlumni,
  msAlumni,
}: {
  faculty: Member[];
  membersByCategory: Record<string, Member[]>;
  phdAlumni: Member[];
  msAlumni: Member[];
}) {
  const { index, label, variant } = getSectionMeta("people");

  return (
    <Section id="people" variant={variant}>
      <Reveal>
        <SectionHeader index={index} title={label} />
      </Reveal>

      <Reveal delayMs={80} className="mb-12">
        {faculty.map((professor) => (
          <ProfessorBlock key={professor.id} professor={professor} />
        ))}
      </Reveal>

      <div className="mb-12 border-t border-gray-200" />

      <Reveal delayMs={120}>
        <Tab
          tabs={[
            {
              label: "Members",
              content: <CurrentMembersPanel membersByCategory={membersByCategory} />,
            },
            {
              label: "Alumni",
              content: <AlumniPanel phdAlumni={phdAlumni} msAlumni={msAlumni} />,
            },
          ]}
        />
      </Reveal>
    </Section>
  );
}
