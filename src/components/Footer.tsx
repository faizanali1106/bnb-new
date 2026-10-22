import { companyLinks, industryLinks, offerLinks, serviceMenu } from "@/data/nav";
import { contactInfo } from "@/data/site";
import { loadMergedSiteContent } from "@/lib/cms/load-from-supabase";
import CircuitMark from "./art/CircuitMark";
import FooterDeck from "./FooterDeck";
import Logo from "./Logo";
import Arrow from "./ui/Arrow";
import { Instagram, LinkedIn } from "./ui/icons";
import Pixels from "./ui/Pixels";
import SplitText from "./ui/SplitText";
import TLink from "./ui/TLink";

const columns = [
  { title: "Services", links: serviceMenu.map((g) => ({ label: g.title, href: g.href })) },
  { title: "Industries", links: industryLinks },
  {
    title: "Start here",
    links: [
      ...offerLinks.map((o) => ({ label: o.label, href: o.href })),
      { label: "Work & case studies", href: "/work" },
      { label: "Resources", href: "/resources" },
    ],
  },
  { title: "Company", links: companyLinks.map(({ label, href }) => ({ label, href })) },
];

export default async function Footer() {
  const content = await loadMergedSiteContent();
  const socials = content.socialMedia.filter((s) => /linkedin|instagram/i.test(s.name));
  const year = new Date().getFullYear();
  const deck = content.teamMembers
    .filter((m) => !m.hidden && m.photo?.trim())
    .slice(0, 8)
    .map((m) => ({ name: m.name, role: m.role, photo: m.photo }));

  return (
    <footer className="footer">
      <div className="footer__tile">
        <div className="footer__noise" />

        <div className="footer__expert">
          <div className="footer__art">
            <CircuitMark tone="dark" />
          </div>
          <TLink href="/contact" className="footer__words hover-arrow">
            <SplitText as="span" className="footer__word footer__word--l" text="Let's build" />
            <span className="footer__card">
              <FooterDeck people={deck} />
              <Arrow size="lg" />
            </span>
            <SplitText as="span" className="footer__word" text="*what's next*" />
          </TLink>
          <Pixels pattern="0000/000b/00a3/0000" />
        </div>

        <div className="footer__info">
          <div className="footer__info-inner">
            <div className="footer__grid">
              <div className="footer__brand">
                <Logo />
                <p className="footer__tagline">{content.settings.footerTagline}</p>
                <a className="footer__email" href={`mailto:${contactInfo.email}`}>
                  {contactInfo.email}
                </a>
              </div>
              <div className="footer__cols">
                {columns.map((c) => (
                  <div key={c.title}>
                    <div className="footer__h">{c.title}</div>
                    <ul className="footer__list">
                      {c.links.map((l) => (
                        <li key={`${c.title}-${l.href}`}>
                          <TLink href={l.href}>{l.label}</TLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="footer__bottom">
              <span>Copyright © {year} Bit &amp; Bytes LLC. All rights reserved.</span>
              <div className="footer__legal">
                <TLink href="/trust">Trust &amp; security</TLink>
                <TLink href="/careers">Careers</TLink>
                <TLink href="/contact">Contact</TLink>
              </div>
              <div className="footer__social">
                {socials.map((s) => (
                  <a key={s.name} href={s.url} aria-label={s.name} target="_blank" rel="noopener noreferrer">
                    {/linkedin/i.test(s.name) ? <LinkedIn /> : <Instagram />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
