import PageHeading from "@/components/ui/PageHeading";
import AlumniTable from "@/components/AlumniTable";
import { getAlumniByDegree } from "@/lib/members";

export default function AlumniPage() {
  const phdAlumni = getAlumniByDegree("phd");
  const msAlumni = getAlumniByDegree("ms");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="Alumni"
        description="공간정보연구실을 졸업한 구성원을 소개합니다."
      />

      {phdAlumni.length > 0 ? (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-ewha-green-900">
            - 박사 졸업생
          </h2>
          <AlumniTable degree="phd" members={phdAlumni} />
        </section>
      ) : null}

      {msAlumni.length > 0 ? (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-ewha-green-900">
            - 석사 졸업생
          </h2>
          <AlumniTable degree="ms" members={msAlumni} />
        </section>
      ) : null}
    </div>
  );
}
