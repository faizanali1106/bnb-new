"use client";

import { ArrowLeft, ClipboardList, Clock, FileText, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { formatPostedAgo, type Job } from "@/data/jobs";
import { lenisRef } from "@/lib/lenis";
import { Checks } from "../blocks/Section";
import { ActionBtn } from "../ui/Btn";
import Eyebrow from "../ui/Eyebrow";
import SplitText from "../ui/SplitText";
import TLink from "../ui/TLink";
import { ApplicationForm } from "./ApplicationForm";
import { JobPills } from "./JobCard";

type Tab = "overview" | "apply";
const tabs = [
  { id: "overview" as const, label: "Overview", icon: ClipboardList },
  { id: "apply" as const, label: "Application", icon: FileText },
];

export function JobDetailView({ job }: { job: Job }) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(searchParams.get("tab") === "apply" ? "apply" : "overview");
  const tabsRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ x: 0, w: 0 });

  // Slide the tab indicator under the active tab.
  useLayoutEffect(() => {
    const btn = tabsRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${tab}"]`);
    if (btn) setInd({ x: btn.offsetLeft, w: btn.offsetWidth });
  }, [tab]);

  const go = (next: Tab) => {
    setTab(next);
    if (tabsRef.current) lenisRef.current?.scrollTo(tabsRef.current, { offset: -120 });
  };

  return (
    <div className="container">
      <TLink href="/careers" className="text-link" style={{ marginBottom: "3rem" }}>
        <ArrowLeft /> All openings
      </TLink>

      <div style={{ margin: "2.5rem 0 4rem" }}>
        <Eyebrow>{job.department}</Eyebrow>
        <SplitText as="h1" className="h-page" text={job.title} trigger="load" />
        <div className="btn-row" style={{ marginTop: "2.5rem" }}>
          <JobPills employmentType={job.employmentType} workMode={job.workMode} />
          <div className="job-meta">
            <span>
              <MapPin /> {job.location}
            </span>
            <span>
              <Clock /> {formatPostedAgo(job.postedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="tabs" ref={tabsRef} role="tablist">
        <span className="tabs__ind" style={{ width: ind.w, transform: `translateX(${ind.x}px)` }} />
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            data-tab={t.id}
            aria-selected={tab === t.id}
            className={tab === t.id ? "is-active" : ""}
            onClick={() => setTab(t.id)}
          >
            <t.icon /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div key="overview" className="fade-swap" style={{ display: "grid", gap: "1rem" }}>
          <section className="tile tile--pad-lg">
            <h2 className="h5" style={{ marginBottom: "1.25rem" }}>
              About the role
            </h2>
            <p className="p-m soft">{job.about}</p>
          </section>
          <OverviewList title="What you will do" items={job.responsibilities} />
          <OverviewList title="What we are looking for" items={job.requirements} />
          <OverviewList title="Benefits" items={job.benefits} />
          <div style={{ marginTop: "1.5rem" }}>
            <ActionBtn type="button" onClick={() => go("apply")}>
              Apply for this role
            </ActionBtn>
          </div>
        </div>
      ) : (
        <div key="apply" className="fade-swap form-card">
          <ApplicationForm job={job} />
        </div>
      )}
    </div>
  );
}

function OverviewList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="tile tile--pad-lg">
      <h2 className="h5" style={{ marginBottom: "1.75rem" }}>
        {title}
      </h2>
      <Checks items={items} />
    </section>
  );
}
