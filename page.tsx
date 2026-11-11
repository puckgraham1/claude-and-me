import Link from "next/link";
import { rivers } from "@/data";
import { EmailSignup } from "@/components/EmailSignup";
import { RiseMark } from "@/components/RiseMark";

export default function Home() {
  return (
    <div className="wrap stack" style={{ gap: 28, paddingTop: 28 }}>
      <section className="stack" style={{ gap: 12, maxWidth: 680 }}>
        <RiseMark size={64} />
        <div className="eyebrow">Fly fishing river guides</div>
        <h1 className="display" style={{ fontSize: "clamp(40px, 8vw, 64px)" }}>
          Know what the trout are eating before you get to the river.
        </h1>
        <p style={{ margin: 0, fontSize: 17, maxWidth: "60ch" }} className="muted">
          Tap into a living cross-section of the river: every fish, every hatch, the flies that match them,
          and the science behind every rise.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/deschutes" className="btn">Explore the Deschutes</Link>
          <Link href="/rise-decoder" className="btn ghost">Decode a rise</Link>
        </div>
      </section>

      <section className="stack" style={{ gap: 10 }}>
        <h2 className="section-title">Rivers</h2>
        <div className="species-grid">
          {rivers.map((r) => (
            <Link key={r.slug} href={`/${r.slug}`} className="card">
              <span className="dot" style={{ background: "var(--accent)" }} />
              <span>{r.name}<br /><span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>{r.region}</span></span>
            </Link>
          ))}
          {["Metolius", "McKenzie", "Yakima"].map((n) => (
            <div key={n} className="card" style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 48, padding: "8px 12px", fontSize: 14, color: "var(--muted)" }}>
              <span className="dot" style={{ background: "#d3d8cf" }} />{n} · coming soon
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 560 }}>
        <EmailSignup />
      </section>
    </div>
  );
}
