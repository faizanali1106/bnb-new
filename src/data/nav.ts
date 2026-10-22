import { findServiceBySlug, liveServices, serviceGroups, serviceHref } from "@/data/services";
import { industries } from "@/data/industries";
import { company, contactInfo, offers, trust } from "@/data/site";

export type NavLink = { label: string; href: string };

/** Left-hand item of a two-column dropdown; `links` show on the right when it is hovered. */
export type MenuGroup = {
  title: string;
  href: string;
  more?: string;
  links: { label: string; href: string; desc: string }[];
};

/** Top-level menu items without a dropdown. */
export const directLinks: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Resources", href: "/resources" },
];

export const companyLinks: (NavLink & { desc: string })[] = [
  { label: "About", href: "/company", desc: "Our story, beliefs and the team." },
  { label: "How we work", href: "/company#how-we-work", desc: "Phases, communication and time zones." },
  { label: "Trust & security", href: "/trust", desc: "Data handling, compliance and access." },
  { label: "Careers", href: "/careers", desc: "Open roles at Bit & Bytes." },
  { label: "Contact", href: "/contact", desc: "Book a call with a senior engineer." },
];

export const industryLinks: NavLink[] = industries.map((i) => ({ label: i.title, href: `/industries/${i.slug}` }));

export const offerLinks = offers.map((o) => ({ label: o.name, href: `/offers/${o.slug}`, duration: o.duration }));

export const serviceMenu: MenuGroup[] = serviceGroups.map((g) => ({
  title: g.title,
  href: `/services/${g.slug}`,
  links: liveServices(g).map((s) => ({ label: s.title, href: serviceHref(g, s), desc: s.blurb })),
}));

export const industryMenu: MenuGroup[] = industries.map((i) => ({
  title: i.title,
  href: `/industries/${i.slug}`,
  links: i.useCases.map((u) => {
    const found = findServiceBySlug(u.service);
    return {
      label: u.title,
      desc: u.desc,
      href: found ? serviceHref(found.group, found.service) : `/industries/${i.slug}#use-cases`,
    };
  }),
}));

export const companyMenu: MenuGroup[] = [
  {
    title: "About",
    href: "/company",
    more: "Read about us",
    links: [
      { label: "Our story", href: "/company#story", desc: "A senior team building AI and software for US and UK companies." },
      { label: "What we believe", href: "/company#beliefs", desc: "No agent without a KPI baseline, plus the other rules we work by." },
      { label: "Why Bit & Bytes", href: "/company#why", desc: "Senior builders, decision gates and code you own." },
      { label: "Our team", href: "/company/team", desc: "Meet the engineers you will work with." },
    ],
  },
  {
    title: "How we work",
    href: "/company#how-we-work",
    more: "See how we work",
    links: company.howWeWork.map((h) => ({ label: h.title, href: "/company#how-we-work", desc: h.desc })),
  },
  {
    title: "Trust & security",
    href: "/trust",
    more: "Visit the trust centre",
    links: trust.sections.map((t) => ({ label: t.title, href: `/trust#${t.id}`, desc: t.points[0] })),
  },
  {
    title: "Careers",
    href: "/careers",
    more: "See open roles",
    links: [
      { label: "Open roles", href: "/careers#openings", desc: "Current openings at Bit & Bytes." },
      { label: "Meet the team", href: "/company/team", desc: "The people you would be working with." },
    ],
  },
  {
    title: "Contact",
    href: "/contact",
    more: "Go to the contact page",
    links: [
      { label: "Book a call", href: "/contact", desc: `Talk to a senior engineer. ${contactInfo.responseTime}` },
      { label: "Email", href: `mailto:${contactInfo.email}`, desc: contactInfo.email },
    ],
  },
];
