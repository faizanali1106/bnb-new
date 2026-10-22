"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { lenisRef } from "@/lib/lenis";
import Logo from "./Logo";
import { menus, navOrder, type Menu } from "./navData";
import Arrow from "./ui/Arrow";
import Btn from "./ui/Btn";
import Glyph from "./ui/Glyph";
import { Chevron } from "./ui/icons";
import TLink from "./ui/TLink";

export default function Nav() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState<string | null>(null);
  const [shown, setShown] = useState<Menu>(menus[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const close = () => {
      setOpen(null);
      setMobileOpen(false);
      setMobileSection(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    window.addEventListener("page:leave", close);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("page:leave", close);
    };
  }, []);

  // Freeze page scrolling while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    lenisRef.current?.stop();
    return () => lenisRef.current?.start();
  }, [mobileOpen]);

  const clearTimer = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };
  const show = (label: string | null) => {
    clearTimer();
    setOpen(label);
    const menu = menus.find((m) => m.label === label);
    if (menu) setShown(menu);
  };
  const scheduleClose = () => {
    clearTimer();
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };
  const closeAll = () => {
    setOpen(null);
    setMobileOpen(false);
  };

  const isActive = (prefixes: string[]) => prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  let tileIndex = 0;

  return (
    <>
      <div className={`nav-fade${open !== null || mobileOpen ? " is-on" : ""}`} onClick={closeAll} />
      <header className={`nav${mobileOpen ? " is-mobile-open" : ""}`} onMouseLeave={scheduleClose} onMouseEnter={clearTimer}>
        <div className="nav__panel">
          <div className="nav__bar">
            <Logo />

            <nav className="nav__links" aria-label="Main">
              {navOrder.map((item) =>
                item.type === "menu" ? (
                  <button
                    key={item.menu.label}
                    className={`nav__link${open === item.menu.label ? " is-open" : ""}${isActive(item.menu.prefixes) ? " is-current" : ""}`}
                    aria-expanded={open === item.menu.label}
                    aria-haspopup="true"
                    onMouseEnter={() => show(item.menu.label)}
                    onClick={() => show(open === item.menu.label ? null : item.menu.label)}
                  >
                    {item.menu.label}
                    <Chevron className="nav__chev" />
                  </button>
                ) : (
                  <TLink
                    key={item.href}
                    href={item.href}
                    className={`nav__link${isActive([item.href]) ? " is-current" : ""}`}
                    onMouseEnter={() => show(null)}
                  >
                    {item.label}
                  </TLink>
                ),
              )}
            </nav>

            <Btn href="/contact" size="sm" className="nav__cta">
              Book a call
            </Btn>

            <button
              className="nav__burger"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
            </button>
          </div>

          {/* Desktop mega dropdown */}
          <div className={`nav__drop nav__drop--desk${open ? " is-open" : ""}`}>
            <div className="nav__drop-inner">
              <div className="nav__scroll" data-lenis-prevent>
                <div className="nav__grid" key={shown.label}>
                  {shown.rows.map((row, r) => (
                    <div key={r}>
                      {row.label ? <div className="label nav__row-label">{row.label}</div> : null}
                      <div className="nav__row" style={{ marginTop: row.label ? "0.5rem" : 0 }}>
                        {row.tiles.map((t) => (
                          <TLink
                            key={t.href}
                            href={t.href}
                            onClick={closeAll}
                            className={`nav-tile hover-arrow${row.small ? " nav-tile--sm" : ""}`}
                            style={{ "--i": tileIndex++ } as React.CSSProperties}
                            tabIndex={open ? 0 : -1}
                          >
                            <div className="nav-tile__top">
                              {t.group ? <Glyph group={t.group} className="nav-tile__icon" /> : null}
                              <div>
                                {t.meta ? <div className="nav-tile__meta">{t.meta}</div> : null}
                                <div className="nav-tile__h">{t.title}</div>
                                <div className="nav-tile__p">{t.text}</div>
                              </div>
                            </div>
                            <Arrow />
                          </TLink>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="nav__row" style={{ justifyContent: "flex-end", padding: "0.25rem 0.25rem 0" }}>
                    <Btn href={shown.footer.href} variant="tile" size="sm">
                      {shown.footer.label}
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`nav__drop${mobileOpen ? " is-open" : ""}`}>
            <div className="nav__drop-inner">
              <div className="nav__scroll" data-lenis-prevent>
                <div className="nav__mobile">
                  {navOrder.map((item) =>
                    item.type === "menu" ? (
                      <div key={item.menu.label} className={`m-acc${mobileSection === item.menu.label ? " is-open" : ""}`}>
                        <button
                          aria-expanded={mobileSection === item.menu.label}
                          onClick={() => setMobileSection((s) => (s === item.menu.label ? null : item.menu.label))}
                        >
                          {item.menu.label}
                          <Chevron />
                        </button>
                        {mobileSection === item.menu.label ? (
                          <div className="m-acc__links">
                            {item.menu.rows.flatMap((row) =>
                              row.tiles.map((t) => (
                                <TLink key={t.href} href={t.href} onClick={closeAll}>
                                  {t.title}
                                  {t.meta ? <span className="muted">{t.meta.split(" · ")[1]}</span> : null}
                                </TLink>
                              )),
                            )}
                            <TLink href={item.menu.footer.href} className="accent" onClick={closeAll}>
                              {item.menu.footer.label} →
                            </TLink>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <TLink key={item.href} href={item.href} className="m-link" onClick={closeAll}>
                        {item.label}
                      </TLink>
                    ),
                  )}
                  <Btn href="/contact" className="btn--block">
                    Book a call
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
