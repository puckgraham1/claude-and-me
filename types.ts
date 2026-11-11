// Shared content types. Every river is one data file shaped like `River`.

export type Kind = "fish" | "insect";

export type Fly = {
  name: string;
  size: string; // hook size range, e.g. "14–16"
  stage: string; // Nymph, Adult, Emerger…
  when: string; // one line on when/how to fish it
};

export type Stage = { name: string; time?: string; text: string; fishIt?: string };
export type Method = { name: string; text: string };
export type Fact = { label: string; value: string };
export type Tag = { label: string; tone?: "native" | "intro" | "protect" };

export type Species = {
  slug: string;
  kind: Kind;
  name: string;
  scientific: string;
  aka?: string;
  color: string; // marker color in the scene and lists
  tags: Tag[];
  /** months (0 = Jan) the fish is in the river / the adult insect is out */
  active: number[];
  /** peak months */
  peak: number[];
  summary: string;
  flies: Fly[];
  /** shown instead of flies, e.g. for protected species */
  noFliesNote?: string;
  lifeCycle: Stage[];
  methods: Method[];
  facts: Fact[];
};

export type River = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  intro: string;
  regulationsNote: string;
  species: Species[];
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const ALL_YEAR = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
