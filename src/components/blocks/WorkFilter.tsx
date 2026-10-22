"use client";

import { useMemo, useState } from "react";
import type { CaseStudy } from "@/data/work";
import { CaseCard } from "./cards";

type Option = { value: string; label: string };

/** Case-study grid filterable by service area and industry. */
export function WorkFilter({ cases, groups, industries }: { cases: CaseStudy[]; groups: Option[]; industries: Option[] }) {
  const [group, setGroup] = useState("all");
  const [industry, setIndustry] = useState("all");

  const filtered = useMemo(
    () => cases.filter((c) => (group === "all" || c.groups.includes(group)) && (industry === "all" || c.industrySlug === industry)),
    [cases, group, industry],
  );

  return (
    <div>
      <div style={{ display: "grid", gap: "1rem", marginBottom: "3rem" }}>
        <FilterRow label="Service" value={group} onChange={setGroup} options={groups} />
        <FilterRow label="Industry" value={industry} onChange={setIndustry} options={industries} />
      </div>
      {filtered.length ? (
        <div className="grid grid--4" key={`${group}-${industry}`}>
          {filtered.map((c, i) => (
            <div key={c.slug} className="fade-swap" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}>
              <CaseCard study={c} />
            </div>
          ))}
        </div>
      ) : (
        <p className="tile p-m soft" style={{ textAlign: "center", padding: "4rem" }}>
          No case studies match both filters yet.
        </p>
      )}
    </div>
  );
}

function FilterRow({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Option[] }) {
  return (
    <div className="chips" style={{ alignItems: "center" }}>
      <span className="label" style={{ width: "7rem" }}>
        {label}
      </span>
      {[{ value: "all", label: "All" }, ...options].map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`chip chip--card chip--sm${value === o.value ? " is-active" : ""}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
