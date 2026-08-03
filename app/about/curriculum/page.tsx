import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";

const CURRICULUM = [
  {
    name: "공간정보융합트랙 (학부)",
    description:
      "지리학적 소양을 기반으로 공간정보기술과 컴퓨터 프로그래밍을 결합해 공간정보 전문가를 양성하는 학부 트랙입니다. 인터넷 지도 서비스 기업이나 공간정보 SI업체 진출을 목표로 합니다.",
    details: [
      "사회과교육과 지리교육전공: 지리전공 4과목 + 공간정보기술실무 인턴십(선택)",
      "컴퓨터공학과: 11개 과목 중 6개 과목 선택",
      "컴퓨터공학과 부전공: 트랙 6과목 + 1과목 추가, 전공 5과목 이상 이수",
    ],
  },
  {
    name: "공간정보 융복합 특성화 대학원",
    description:
      "국토교통부가 2014년부터 공간정보 핵심인재 양성을 위해 선정하는 특성화대학원으로, 이화여자대학교는 전국 지리학과 중 유일하게 선정되었습니다. 2016년 이후 지원자 전원이 장학생으로 선발되고 있으며, 석사 2년·박사 3년간 전액 장학금이 지원됩니다.",
    details: [
      "공간정보학 분야: 공간정보 분석, GIS, 원격탐사, 공간통계학, 웹GIS, 프로그래밍, 데이터마이닝 등",
      "공간정보 응용학 분야: 지형학, 수문지리학, 기후학, 문화지리학, 지리교육론 등",
    ],
  },
];

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="Curriculum"
        description="공간정보연구실의 학부·대학원 교육과정을 소개합니다."
      />

      <div className="space-y-4">
        {CURRICULUM.map((program) => (
          <Card key={program.name}>
            <p className="font-medium text-gray-900">{program.name}</p>
            <p className="mt-2 text-sm text-gray-600">{program.description}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
              {program.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
