import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import PublicationsExplorer from "@/components/publications/PublicationsExplorer";
import { getSectionMeta } from "@/lib/sections";
import type { Publication } from "@/lib/publications";

export default function PublicationsSection({
  publications,
}: {
  publications: Publication[];
}) {
  const { index, label, variant } = getSectionMeta("publications");

  return (
    <Section id="publications" variant={variant}>
      <Reveal>
        <SectionHeader index={index} title={label} />
      </Reveal>
      <PublicationsExplorer publications={publications} />
    </Section>
  );
}
