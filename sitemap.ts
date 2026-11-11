import type { MetadataRoute } from "next";
import { rivers, SITE_URL } from "@/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/rise-decoder"];
  for (const r of rivers) {
    pages.push(`/${r.slug}`);
    for (const s of r.species) pages.push(`/${r.slug}/${s.slug}`);
  }
  return pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" }));
}
