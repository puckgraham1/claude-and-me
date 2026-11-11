import { deschutes } from "./deschutes";
import { River } from "./types";

// Add new rivers here (e.g. metolius, mckenzie) and they get pages automatically.
export const rivers: River[] = [deschutes];

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export function getRiver(slug: string) {
  return rivers.find((r) => r.slug === slug);
}

export function getSpecies(riverSlug: string, speciesSlug: string) {
  return getRiver(riverSlug)?.species.find((s) => s.slug === speciesSlug);
}
