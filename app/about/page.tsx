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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="About Us"
        description="이화여자대학교 공간정보연구실(GIS Lab)을 소개합니다."
      />

      <section>
        <h2 className="text-xl font-semibold text-ewha-green-900">연구실 소개</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">
          이화여자대학교 공간정보연구실은 공간정보 및 GIS를 기반으로 보행자 안전,
          도시공간 분석, 공간 빅데이터 분석·시각화, GeoAI 등 다양한 연구를
          수행하고 있습니다. 특히 거리영상과 딥러닝 기술을 접목하여 도시환경을
          지능적으로 평가하는 연구에 강점을 가지고 있습니다.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-ewha-green-900">지도교수</h2>
        <p className="mt-4 text-gray-600">
          강영옥 교수 (이화여자대학교 사회과교육과 지리전공)
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-ewha-green-900">연구 분야</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {RESEARCH_AREAS.map((area) => (
            <Card key={area.title}>
              <p className="font-medium text-gray-900">{area.title}</p>
              <p className="mt-2 text-sm text-gray-600">{area.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
