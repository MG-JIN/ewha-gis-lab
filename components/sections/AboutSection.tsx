import Image from "next/image";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import SubHeading from "@/components/ui/SubHeading";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import { withBasePath } from "@/lib/site";
import { getSectionMeta } from "@/lib/sections";
import {
  IconMapPin,
  IconLayers,
  IconWalk,
  IconChartBar,
  IconCpu,
  IconCamera,
  IconCity,
} from "@/components/ui/icons";

const RESEARCH_AREAS = [
  {
    title: "공간정보 및 GIS",
    description: "지리공간 데이터의 수집, 관리, 분석을 위한 GIS 이론과 응용 연구를 수행합니다.",
    Icon: IconMapPin,
  },
  {
    title: "지리정보체계",
    description: "지리정보체계(GIS) 기반의 공간 데이터베이스 구축 및 활용 방법을 연구합니다.",
    Icon: IconLayers,
  },
  {
    title: "보행자 안전 분석",
    description: "거리영상과 딥러닝 기술을 활용해 보행환경과 보행자 안전을 평가합니다.",
    Icon: IconWalk,
  },
  {
    title: "공간 빅데이터 분석 및 시각화",
    description: "대용량 공간 데이터를 분석하고 시각화하여 공간 현상을 효과적으로 전달합니다.",
    Icon: IconChartBar,
  },
  {
    title: "GeoAI",
    description: "인공지능 기술을 공간정보 분석에 접목한 GeoAI(Geo-Spatial AI) 연구를 수행합니다.",
    Icon: IconCpu,
  },
  {
    title: "거리영상과 딥러닝 활용",
    description: "거리영상(Street View)과 딥러닝 모델을 활용한 도시환경 인지·평가 연구를 수행합니다.",
    Icon: IconCamera,
  },
  {
    title: "도시공간 분석",
    description: "도시 내 공간 현상과 문제를 분석하여 정책적 시사점을 도출하는 연구를 수행합니다.",
    Icon: IconCity,
  },
];

export default function AboutSection() {
  const { index, label, variant } = getSectionMeta("about");

  return (
    <Section id="about" variant={variant}>
      <Reveal>
        <SectionHeader index={index} title={label} />
      </Reveal>

      <Reveal delayMs={80}>
        <SubHeading title="Our Vision" />
        <div className="flex flex-col items-start gap-8 md:flex-row md:gap-12">
          <div className="w-full md:w-2/5">
            <Image
              src={withBasePath("/images/intro.jpg")}
              alt="이화여자대학교 공간정보연구실"
              width={1420}
              height={2345}
              className="h-auto w-full rounded-lg border border-gray-200 shadow-sm"
            />
          </div>
          <div className="mx-auto w-full max-w-2xl md:mx-0 md:w-3/5">
            <p className="leading-loose text-gray-600">
              공간정보는 특정현상의 위치와 특성에 관한 정보로, 정보화 시대에 그 중요성이 나날이 커지고 있습니다. 오늘날 우리 사회의 문제를 파악하고, 해결하기 위해서는 국토, 도시 및 지구 환경 모니터링에 필요한 다양한 정보를 구축하고, 구축된 정보에 머신러닝, 인공지능 등 다양한 분석기술을 적용하여 과학적이고 합리적인 진단과 예측을 가능하도록 해야 합니다.
            </p>
            <p className="mt-4 leading-loose text-gray-600">
              공간정보연구실(Geographic Information Science Lab)은 공간 빅데이터 분석 및 GeoAI와 관련된 분야의 연구를 하고 있습니다. 주된 연구분야로 교통카드 데이터, 통신 기지국데이터, 지자체 민원데이터, 모바일 로그 데이터, SNS데이터 등 공간 빅데이터 분석 및 시각화, 시계열 분석관련 연구를 진행하였으며, 최근에는 GeoAI분야에 연구를 집중하고 있습니다. 외국인 관광객이 게시한 사진 분류 정확도 향상을 위한 전이학습 모델 개발, 거리영상 이미지에 대한 사람들의 정성적 평가를 학습할 수 있는 딥러닝 모델 연구, 공간자료의 시계열성을 고려한 딥러닝 모델, 사람/퍼스널 모빌리티 등 이동체 중심 트레젝토리 데이터 패턴분석 및 시계열 예측을 위한 시계열 딥러닝 모델 연구 등을 하고 있습니다.
            </p>
            <p className="mt-4 leading-loose text-gray-600">
              학부과정으로는 이화여자대학교 대학혁신지원사업의 일환으로 &quot;공간정보 융합트랙&quot;을 2015년부터 운영하고 있으며, 대학원 과정으로 2014년부터 국토교통부의 공간정보 특성화대학원으로 지정되어 &quot;공간정보 특성화대학원&quot; 프로그램을 운영하고 있습니다.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delayMs={0} className="mt-16">
        <SubHeading title="Research Topics" />
        <div className="grid gap-4 sm:grid-cols-3">
          {RESEARCH_AREAS.map(({ title, description, Icon }) => (
            <Card key={title}>
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ewha-green-50 text-ewha-green-900">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium text-gray-900">{title}</p>
                  <p className="mt-2 text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
