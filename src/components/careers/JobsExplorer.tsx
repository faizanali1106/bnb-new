"use client";

import { Briefcase, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { filterJobs, JOBS_PAGE_SIZE, type Job } from "@/data/jobs";
import { JobCard } from "./JobCard";

/** Searchable, infinitely-loading list of open roles. */
export function JobsExplorer({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(JOBS_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filteredJobs = useMemo(() => filterJobs(jobs, query), [jobs, query]);
  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;
    let timeoutId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || isLoadingMore) return;
        setIsLoadingMore(true);
        timeoutId = window.setTimeout(() => {
          setVisibleCount((count) => Math.min(count + JOBS_PAGE_SIZE, filteredJobs.length));
          setIsLoadingMore(false);
        }, 450);
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [filteredJobs.length, hasMore, isLoadingMore]);

  return (
    <div>
      <div className="search">
        <label htmlFor="job-search" className="sr-only">
          Search roles
        </label>
        <Search />
        <input
          id="job-search"
          type="search"
          className="input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisibleCount(JOBS_PAGE_SIZE);
          }}
          placeholder="Search by title, team, location, or type"
        />
      </div>
      <p className="p-s soft" style={{ textAlign: "center", marginBottom: "3rem" }}>
        Showing {visibleJobs.length} of {filteredJobs.length} open role{filteredJobs.length === 1 ? "" : "s"}
      </p>

      {visibleJobs.length ? (
        <div className="grid grid--2" key={query}>
          {visibleJobs.map((job, i) => (
            <div key={job.id} className="fade-swap" style={{ animationDelay: `${(i % JOBS_PAGE_SIZE) * 0.06}s`, animationFillMode: "both" }}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      ) : (
        <div className="tile tile--pad-lg" style={{ textAlign: "center" }}>
          <Briefcase size="2.5rem" className="accent" style={{ margin: "0 auto 1rem" }} />
          <p className="p-m">No roles match that search.</p>
        </div>
      )}

      {hasMore ? (
        <div ref={sentinelRef} style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}>
          {isLoadingMore ? <Loader2 className="spinner" /> : null}
        </div>
      ) : null}
    </div>
  );
}
