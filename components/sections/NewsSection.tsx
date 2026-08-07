import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import NewsExplorer from "@/components/news/NewsExplorer";
import { getSectionMeta } from "@/lib/sections";
import type { NewsSummary } from "@/lib/news";

export default function NewsSection({ newsList }: { newsList: NewsSummary[] }) {
  const { index, label, variant } = getSectionMeta("news");

  return (
    <Section id="news" variant={variant}>
      <Reveal>
        <SectionHeader index={index} title={label} />
      </Reveal>
      <NewsExplorer newsList={newsList} />
    </Section>
  );
}
