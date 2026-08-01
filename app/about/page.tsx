import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";

const RESEARCH_AREAS = [
  {
    title: "공간정보 및 GIS",
    description: "지리공간 데이터의 수집, 관리, 분석을 위한 GIS 이론과 응용 연구를 수행합니다.",
  },
  {
    title: "지리정보체계",
    description: "지리정보체계(GIS) 기반의 공간 데이터베이스 구축 및 활용 방법을 연구합니다.",
  },
  {
    title: "보행자 안전 분석",
    description: "거리영상과 딥러닝 기술을 활용해 보행환경과 보행자 안전을 평가합니다.",
  },
  {
    title: "공간 빅데이터 분석 및 시각화",
    description: "대용량 공간 데이터를 분석하고 시각화하여 공간 현상을 효과적으로 전달합니다.",
  },
  {
    title: "GeoAI",
    description: "인공지능 기술을 공간정보 분석에 접목한 GeoAI(Geo-Spatial AI) 연구를 수행합니다.",
  },
  {
    title: "거리영상과 딥러닝 활용",
    description: "거리영상(Street View)과 딥러닝 모델을 활용한 도시환경 인지·평가 연구를 수행합니다.",
  },
  {
    title: "도시공간 분석",
    description: "도시 내 공간 현상과 문제를 분석하여 정책적 시사점을 도출하는 연구를 수행합니다.",
  },
];

const HISTORY = [
  { year: "2014", event: "국토교통부 공간정보 특성화대학원으로 선정" },
];

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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="About Us"
        description="이화여자대학교 공간정보연구실(GIS Lab)을 소개합니다."
      />

      <section>
        <h2 className="text-xl font-semibold text-gray-900">연구실 소개</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">
          이화여자대학교 공간정보연구실은 공간정보 및 GIS를 기반으로 보행자 안전,
          도시공간 분석, 공간 빅데이터 분석·시각화, GeoAI 등 다양한 연구를
          수행하고 있습니다. 특히 거리영상과 딥러닝 기술을 접목하여 도시환경을
          지능적으로 평가하는 연구에 강점을 가지고 있습니다.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900">지도교수</h2>
        <p className="mt-4 text-gray-600">
          강영옥 교수 (이화여자대학교 사회과교육과 지리전공)
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900">연혁</h2>
        <ul className="mt-4 space-y-2">
          {HISTORY.map((item) => (
            <li key={item.year} className="flex gap-4 text-gray-600">
              <span className="w-14 font-medium text-gray-900">{item.year}</span>
              <span>{item.event}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900">연구 분야</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {RESEARCH_AREAS.map((area) => (
            <Card key={area.title}>
              <p className="font-medium text-gray-900">{area.title}</p>
              <p className="mt-2 text-sm text-gray-600">{area.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900">교육과정</h2>
        <div className="mt-4 space-y-4">
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
      </section>
    </div>
  );
}
