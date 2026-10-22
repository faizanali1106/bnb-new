"use client";

import { useState } from "react";
import type { Faq } from "@/data/site";

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={`faq__item${isOpen ? " is-open" : ""}`}>
            <button className="faq__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
              <span>{item.q}</span>
              <span className="faq__icon" aria-hidden />
            </button>
            <div className="faq__a">
              <div>
                <p className="p-s">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
