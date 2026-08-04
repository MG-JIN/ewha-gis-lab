import type { Member } from "@/lib/members";

export default function AlumniTable({
  degree,
  members,
}: {
  degree: "phd" | "ms";
  members: Member[];
}) {
  const thesisLabel = degree === "phd" ? "박사학위논문" : "석사학위논문";
  const isMs = degree === "ms";
  const sorted = [...members].sort(
    (a, b) => (b.gradYear ?? 0) - (a.gradYear ?? 0)
  );

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-gray-200 md:block">
        <table
          className={
            isMs
              ? "w-full table-fixed border-collapse text-sm"
              : "w-full border-collapse text-sm"
          }
        >
          {isMs ? (
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[58%]" />
              <col className="w-[18%]" />
            </colgroup>
          ) : null}
          <thead>
            <tr className="bg-ewha-green-50">
              <th className="px-4 py-3 text-center font-bold text-ewha-green-900">
                성명
              </th>
              <th className="px-4 py-3 text-center font-bold text-ewha-green-900">
                졸업년도
              </th>
              <th className="px-4 py-3 text-center font-bold text-ewha-green-900">
                {thesisLabel}
              </th>
              <th className="px-4 py-3 text-center font-bold text-ewha-green-900">
                재직기관
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((member) => (
              <tr key={member.id} className="border-t border-gray-200">
                <td className="px-4 py-3 text-center font-bold text-gray-900">
                  {member.name}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {member.gradYear}
                </td>
                <td className="px-4 py-3 text-left leading-relaxed text-gray-600">
                  {member.thesis}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {member.affiliation ?? ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {sorted.map((member) => (
          <div
            key={member.id}
            className="rounded-lg border border-gray-200 p-4"
          >
            <p className="font-bold text-gray-900">{member.name}</p>
            <p className="mt-1 text-sm text-gray-600">
              졸업년도: {member.gradYear}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {thesisLabel}: {member.thesis}
            </p>
            {member.affiliation ? (
              <p className="mt-1 text-sm text-gray-600">
                재직기관: {member.affiliation}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
