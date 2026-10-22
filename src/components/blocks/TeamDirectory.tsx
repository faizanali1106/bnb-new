"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { TeamMemberSerialized } from "@/lib/cms/types";

const DEPT_ORDER = ["Leadership", "HR", "Engineering", "Business Development", "Design"];
const MALE = "/media/male-avatar.png";
const FEMALE = "/media/female-avatar.png";

const photoFor = (m: TeamMemberSerialized) => m.photo?.trim() || (m.gender === "female" ? FEMALE : MALE);
const deptRank = (d: string) => {
  const i = DEPT_ORDER.indexOf(d);
  return i === -1 ? DEPT_ORDER.length : i;
};

/** Higher = more senior within a department. */
function seniority(role: string, name: string) {
  if (name === "Sabir Ud Din") return 66;
  if (name === "Faizan Ali") return 65;
  const r = role.toLowerCase();
  if (/\bceo\b|\bcoo\b/.test(r)) return 100;
  if (/head of|delivery manager/.test(r)) return 95;
  if (/principal/.test(r)) return 90;
  if (/team lead|tech(?:nical)? lead/.test(r)) return 80;
  if (/manager/.test(r)) return 75;
  if (/senior/.test(r)) return 67;
  if (/lead/.test(r)) return 60;
  if (/automation/.test(r)) return 55;
  if (/executive/.test(r)) return 40;
  if (/quality assurance|\bqa\b/.test(r)) return 35;
  if (/engineer|designer|developer/.test(r)) return 50;
  return 30;
}

/** Team grid with department filter; photos go from grayscale to colour on hover. */
export function TeamDirectory({ members }: { members: TeamMemberSerialized[] }) {
  const visible = useMemo(
    () =>
      members
        .filter((m) => !m.hidden)
        .sort(
          (a, b) =>
            deptRank(a.department) - deptRank(b.department) ||
            seniority(b.role, b.name) - seniority(a.role, a.name) ||
            a.name.localeCompare(b.name),
        ),
    [members],
  );
  const depts = useMemo(() => [...new Set(visible.map((m) => m.department))], [visible]);
  const [dept, setDept] = useState("All");
  const list = dept === "All" ? visible : visible.filter((m) => m.department === dept);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="team-count">
          {visible.length} PEOPLE / {depts.length} DISCIPLINES
        </div>
        <div className="chips">
          {["All", ...depts].map((d) => (
            <button key={d} type="button" className={`chip chip--card chip--sm${dept === d ? " is-active" : ""}`} onClick={() => setDept(d)}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className="team-grid" key={dept}>
        {list.map((m, i) => (
          <figure key={m.name} className="person fade-swap" style={{ animationDelay: `${Math.min(i, 12) * 0.04}s`, animationFillMode: "both" }}>
            <span className="person__bg" />
            <div className="person__photo">
              <span className="tag person__dept">{m.department}</span>
              <Image src={photoFor(m)} alt={m.name} fill sizes="(min-width: 992px) 16vw, 45vw" />
            </div>
            <figcaption>
              <div className="person__name">{m.name}</div>
              <div className="person__role">{m.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
