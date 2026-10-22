"use client";

import Image from "next/image";
import { logosForNames } from "@/data/companies";
import type { CaseStudy } from "@/data/work";
import type { Testimonial } from "@/lib/testimonials";
import { initials } from "@/lib/text";
import CarouselArrows from "../ui/CarouselArrows";
import Reveal from "../ui/Reveal";
import { useCarousel } from "../ui/useCarousel";
import { CaseCard } from "./cards";
import { SectionHeading } from "./Section";

type Head = { eyebrow: string; title: string; sub?: string; action?: { label: string; href: string } };

export function CaseCarousel({ head, cases }: { head: Head; cases: CaseStudy[] }) {
  const { viewportRef, arrows } = useCarousel();
  return (
    <>
      <SectionHeading {...head}>
        <CarouselArrows {...arrows} />
      </SectionHeading>
      <Reveal className="embla" y={60}>
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            {cases.map((c) => (
              <div className="embla__slide" key={c.slug}>
                <CaseCard study={c} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </>
  );
}

export function TestimonialCarousel({ head, items }: { head: Head; items: Testimonial[] }) {
  const { viewportRef, arrows } = useCarousel();
  if (!items.length) return null;
  return (
    <>
      <SectionHeading {...head}>
        <CarouselArrows {...arrows} />
      </SectionHeading>
      <Reveal className="embla embla--wide" y={60}>
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            {items.map((t) => {
              const logo = logosForNames([t.title.replace(/\.ai$/i, "")])[0];
              return (
                <div className="embla__slide" key={`${t.name}-${t.title}`}>
                  <figure className="quote-card">
                    <span className="quote-card__bg" />
                    <blockquote className="quote-card__q">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="quote-card__end">
                      <div className="quote-card__person">
                        <span className="avatar">{initials(t.name)}</span>
                        <div>
                          <div className="quote-card__name">{t.name}</div>
                          <div className="quote-card__role">{t.title}</div>
                        </div>
                      </div>
                      {logo ? (
                        <span className="quote-card__logo">
                          <Image src={logo.black} alt={t.title} fill sizes="9rem" className="logo-light" />
                          <Image src={logo.white} alt="" fill sizes="9rem" className="logo-dark" />
                        </span>
                      ) : null}
                    </figcaption>
                  </figure>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </>
  );
}
