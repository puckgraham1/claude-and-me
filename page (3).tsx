import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRiver, rivers } from "@/data";
import { RiverExplorer } from "@/components/RiverExplorer";
import { EmailSignup } from "@/components/EmailSignup";

type Props = { params: Promise<{ river: string }> };

export function generateStaticParams() {
  return rivers.map((r) => ({ river: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const river = getRiver((await params).river);
  if (!river) return {};
  return {
    title: `${river.name} hatch chart, best flies & fish guide`,
    description: `Interactive ${river.name} guide: what's hatching each month, the best flies, and how to fish for ${river.species
      .filter((s) => s.kind === "fish").map((s) => s.name.toLowerCase()).slice(0, 3).join(", ")}.`,
    alternates: { canonical: `/${river.slug}` },
  };
}

export default async function RiverPage({ params }: Props) {
  const river = getRiver((await params).river);
  if (!river) notFound();
  const fish = river.species.filter((s) => s.kind === "fish");
  const bugs = river.species.filter((s) => s.kind === "insect");

  return (
    <div className="wrap stack" style={{ gap: 20, paddingTop: 20 }}>
      <header className="stack" style={{ gap: 6 }}>
        <div className="eyebrow">{river.region}</div>
        <h1 className="display" style={{ fontSize: "clamp(38px, 7vw, 56px)" }}>{river.name}</h1>
        <p className="muted" style={{ margin: 0, maxWidth: "65ch" }}>{river.intro}</p>
      </header>

      <RiverExplorer river={river} />

      <section className="stack" style={{ gap: 10 }}>
        <h2 className="section-title">Fish of the {river.name}</h2>
        <div className="species-grid">
          {fish.map((s) => (
            <Link key={s.slug} href={`/${river.slug}/${s.slug}`} className="card">
              <span className="dot" style={{ background: s.color }} />{s.name}
            </Link>
          ))}
        </div>
        <h2 className="section-title" style={{ marginTop: 8 }}>Insects & hatches</h2>
        <div className="species-grid">
          {bugs.map((s) => (
            <Link key={s.slug} href={`/${river.slug}/${s.slug}`} className="card">
              <span className="dot" style={{ background: s.color }} />{s.name}
            </Link>
          ))}
        </div>
      </section>

      <p className="note">{river.regulationsNote}</p>
      <div style={{ maxWidth: 560 }}><EmailSignup /></div>
    </div>
  );
}
