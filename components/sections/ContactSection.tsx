import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import { getSectionMeta } from "@/lib/sections";

export default function ContactSection() {
  const { index, label, variant } = getSectionMeta("contact");

  return (
    <Section id="contact" variant={variant}>
      <Reveal>
        <SectionHeader index={index} title={label} />
      </Reveal>
      <Reveal delayMs={80}>
        <div className="grid gap-6 sm:grid-cols-5">
          <div className="h-96 overflow-hidden rounded-lg border border-gray-200 sm:col-span-3">
            <iframe
              src="https://www.google.com/maps?q=이화여자대학교+교육관&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="공간정보연구실 위치 지도"
            />
          </div>
          <div className="sm:col-span-2">
            <Card>
              <p className="font-semibold text-ewha-green-900">공간정보연구실</p>
              <p className="mt-2 text-sm text-gray-500">
                주소: 03760 서울시 서대문구 이화여대길 52 (대현동) 교육관 A동 318호
              </p>
              <p className="mt-1 text-sm text-gray-500">Tel: 02-3277-2658</p>
              <p className="mt-1 text-sm text-gray-500">FAX: 02-3277-2659</p>
            </Card>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
