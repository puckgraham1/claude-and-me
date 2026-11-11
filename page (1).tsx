import type { Metadata } from "next";
import { RiseDecoder } from "@/components/RiseDecoder";

export const metadata: Metadata = {
  title: "Rise decoder: what is that trout eating?",
  description:
    "Splashy rise, quiet sip, head and tail, or a bulge? Learn what each trout rise means and which fly to tie on.",
  alternates: { canonical: "/rise-decoder" },
};

export default function RiseDecoderPage() {
  return (
    <div className="wrap stack" style={{ gap: 16, paddingTop: 24 }}>
      <div className="stack" style={{ gap: 6, maxWidth: 600 }}>
        <div className="eyebrow">Rise decoder</div>
        <h1 className="display" style={{ fontSize: "clamp(36px, 7vw, 52px)" }}>What did the rise look like?</h1>
        <p className="muted" style={{ margin: 0 }}>
          The way a trout breaks the surface tells you what stage of insect it&apos;s eating. Pick the rise you saw.
        </p>
      </div>
      <RiseDecoder />
    </div>
  );
}
