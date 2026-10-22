import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JobDetailView } from "@/components/careers/JobDetailView";
import { getPublishedJobById } from "@/data/jobs";
import { loadMergedSiteContent } from "@/lib/cms/load-from-supabase";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/careers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const job = getPublishedJobById((await loadMergedSiteContent()).jobs, id);
  if (!job) return { title: "Role not found | Careers", description: "This opening is no longer available." };
  return {
    title: `${job.title} | Careers`,
    description: job.summary,
    alternates: { canonical: `/careers/${job.id}` },
    keywords: [job.title, job.department, job.employmentType, job.workMode, "careers"],
  };
}

export default async function JobDetailPage({ params }: PageProps<"/careers/[id]">) {
  const { id } = await params;
  const job = getPublishedJobById((await loadMergedSiteContent()).jobs, id);
  if (!job) notFound();

  return (
    <section className="page-head">
      <Suspense fallback={<div className="container p-m soft">Loading role…</div>}>
        <JobDetailView job={job} />
      </Suspense>
    </section>
  );
}
