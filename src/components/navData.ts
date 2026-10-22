import { companyLinks, directLinks } from "@/data/nav";
import { industries } from "@/data/industries";
import { serviceGroups } from "@/data/services";
import { offers } from "@/data/site";

export type MenuTile = { title: string; text: string; href: string; group?: string; meta?: string };
export type MenuRow = { label?: string; small?: boolean; tiles: MenuTile[] };
export type Menu = { label: string; prefixes: string[]; rows: MenuRow[]; footer: { label: string; href: string } };

const chunk = <T,>(list: T[], size: number) =>
  Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, i * size + size));

const groupTiles: MenuTile[] = serviceGroups.map((g) => ({
  title: g.title,
  text: g.outcome,
  href: `/services/${g.slug}`,
  group: g.slug,
}));

export const menus: Menu[] = [
  {
    label: "Services",
    prefixes: ["/services", "/offers"],
    rows: [
      {
        label: "Start here",
        tiles: offers.map((o) => ({ title: o.name, text: o.tagline, href: `/offers/${o.slug}`, meta: `${o.step} · ${o.duration}` })),
      },
      ...chunk(groupTiles, 5).map((tiles, i) => ({ label: i === 0 ? "Service areas" : undefined, small: true, tiles })),
    ],
    footer: { label: "View all services", href: "/services" },
  },
  {
    label: "Industries",
    prefixes: ["/industries"],
    rows: chunk(
      industries.map((i) => ({
        title: i.title,
        text: `Built here: ${i.built.map((b) => b.name).join(" · ")}`,
        href: `/industries/${i.slug}`,
      })),
      3,
    ).map((tiles) => ({ tiles })),
    footer: { label: "View all industries", href: "/industries" },
  },
  {
    label: "Company",
    prefixes: ["/company", "/trust", "/careers", "/contact"],
    rows: chunk(
      companyLinks.map((c) => ({ title: c.label, text: c.desc, href: c.href })),
      3,
    ).map((tiles) => ({ tiles })),
    footer: { label: "Book a call", href: "/contact" },
  },
];

/** Order of items in the bar: dropdowns and direct links interleaved like the original site. */
export const navOrder: ({ type: "menu"; menu: Menu } | { type: "link"; label: string; href: string })[] = [
  { type: "menu", menu: menus[0] },
  { type: "menu", menu: menus[1] },
  ...directLinks.map((l) => ({ type: "link" as const, label: l.label, href: l.href })),
  { type: "menu", menu: menus[2] },
];
