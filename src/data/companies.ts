export type CompanyLogo = {
  name: string;
  /** Matches case-study client names and similar aliases. */
  aliases?: string[];
  black: string;
  white: string;
};

/** Paths keep spaces; next/image encodes them once. Do not pre-encode. */
const file = (name: string) => `/companies-logo/${name}`;

/** Client logos from public/companies-logo (black for light mode, white for dark). */
export const companyLogos: CompanyLogo[] = [
  { name: "Benchmark", black: file("Benchmark black.png"), white: file("Benchmark White.png") },
  { name: "Breevy", black: file("Breevy Black.png"), white: file("Breevy White.png") },
  { name: "Decode", black: file("Decode  Black.png"), white: file("Decode White.png") },
  { name: "Decode One", black: file("Decode One Black.png"), white: file("Decode One White.png") },
  { name: "Empire HQ", black: file("Empire HQ Black.png"), white: file("Empire HQ White.png") },
  { name: "Fanbase", black: file("Fanbase Black.png"), white: file("Fanbase White.png") },
  { name: "Freelvy", black: file("Freelvy Black.png"), white: file("Freelvy White.png") },
  { name: "Fuzebox", black: file("Fuzebox Black.png"), white: file("Fuzebox White.png") },
  { name: "Lead Ninja", black: file("Lead Ninja Black.png"), white: file("Lead Ninja White.png") },
  { name: "Moonhub", black: file("Moonhub Black.png"), white: file("Moonhub White.png") },
  { name: "Phonefilter", black: file("Phonefilter Black.png"), white: file("Phonefilter White.png") },
  { name: "QB", black: file("QB Black.png"), white: file("QB White.png") },
  { name: "Quilly", black: file("Quilly Black.png"), white: file("Quilly White.png") },
  { name: "Relin", black: file("Relin Black.png"), white: file("Relin White.png") },
  { name: "RingRx", black: file("RingRx Black.png"), white: file("RingRx White.png") },
  { name: "Solya", black: file("Solya Black.png"), white: file("Solya White.png") },
  { name: "ThynkFuel", black: file("ThynkFuel Black.png"), white: file("ThynkFuel White.png") },
  {
    name: "YourList",
    aliases: ["Yourlist", "Your List"],
    black: file("Yourlist Black.png"),
    white: file("Yourlist White.png"),
  },
];

function matchesName(logo: CompanyLogo, name: string) {
  const needle = name.trim().toLowerCase();
  if (logo.name.toLowerCase() === needle) return true;
  return (logo.aliases ?? []).some((a) => a.toLowerCase() === needle);
}

export function logosForNames(names?: string[]) {
  if (!names?.length) return companyLogos;
  const found: CompanyLogo[] = [];
  for (const name of names) {
    const logo = companyLogos.find((c) => matchesName(c, name));
    if (logo && !found.includes(logo)) found.push(logo);
  }
  return found;
}
