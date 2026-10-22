"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Drawer, Input, Modal, Select, Space, Tag, Typography, message } from "antd";
import { Download, Eye, Loader2, RotateCcw, Search, Star, Trash2, UserX } from "lucide-react";
import type { ApplicationStatus, JobApplicationSerialized, JobSerialized } from "@/lib/cms/types";
import { formatPostedAgo } from "@/data/jobs";

const { Text } = Typography;

type Props = {
  jobs: JobSerialized[];
  mode?: "inbox" | "rejected";
};

function statusTag(status: ApplicationStatus) {
  if (status === "new") return <Tag color="cyan">New</Tag>;
  if (status === "rejected") return <Tag color="red">Rejected</Tag>;
  return <Tag>Reviewed</Tag>;
}

function formatRejectionCountdown(dueAt: string, nowMs: number) {
  const dueMs = new Date(dueAt).getTime();
  if (!Number.isFinite(dueMs)) return "Email schedule unavailable";
  const remaining = dueMs - nowMs;
  if (remaining <= 0) return "Email due — sending soon";
  const totalHours = Math.ceil(remaining / (60 * 60 * 1000));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days > 0) return `${days}d ${hours}h until rejection email`;
  if (totalHours > 1) return `${totalHours}h until rejection email`;
  const minutes = Math.max(1, Math.ceil(remaining / (60 * 1000)));
  return `${minutes}m until rejection email`;
}

function rejectionEmailLabel(item: JobApplicationSerialized, nowMs: number) {
  if (item.rejectionEmailSentAt) {
    return `Rejection email sent ${formatPostedAgo(item.rejectionEmailSentAt)}`;
  }
  if (item.rejectionEmailAt) {
    return formatRejectionCountdown(item.rejectionEmailAt, nowMs);
  }
  return "No rejection email scheduled";
}

export function AdminApplicationsPanel({ jobs, mode = "inbox" }: Props) {
  const isRejectedTab = mode === "rejected";
  const [items, setItems] = useState<JobApplicationSerialized[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "new" | "reviewed" | "favorite">("all");
  const [jobId, setJobId] = useState<string>("all");
  const [questionId, setQuestionId] = useState("all");
  const [answerQuery, setAnswerQuery] = useState("");
  const [active, setActive] = useState<JobApplicationSerialized | null>(null);
  const [saving, setSaving] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!isRejectedTab) return;
    const timer = window.setInterval(() => setNowMs(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [isRejectedTab]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (isRejectedTab) {
        params.set("status", "rejected");
      } else if (status !== "all") {
        params.set("status", status);
      }
      if (jobId !== "all") {
        params.set("jobId", String(jobId));
        const selected = jobs.find((job) => String(job.id) === String(jobId));
        if (selected?.title) params.set("jobTitle", selected.title);
      }
      if (questionId && questionId !== "all") params.set("questionId", questionId);
      if (answerQuery.trim()) params.set("answer", answerQuery.trim());
      const res = await fetch(`/api/admin/applications?${params.toString()}`, {
        credentials: "include",
      });
      const json = (await res.json()) as { applications?: JobApplicationSerialized[]; error?: string };
      if (!res.ok) {
        throw new Error(json.error || "Could not load applications.");
      }
      setItems(json.applications ?? []);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }, [answerQuery, isRejectedTab, jobId, jobs, query, questionId, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [load]);


  const selectedJob = useMemo(
    () => jobs.find((job) => String(job.id) === jobId),
    [jobId, jobs]
  );

  const questionOptions = useMemo(
    () => [
      { label: "All screening questions", value: "all" },
      ...(selectedJob?.questions ?? []).map((question) => ({
        label: question.prompt,
        value: question.id,
      })),
    ],
    [selectedJob]
  );

  const jobOptions = useMemo(
    () => [
      { label: "All roles", value: "all" },
      ...jobs
        .filter((job) => job.id != null)
        .map((job) => ({ label: job.title, value: String(job.id) })),
    ],
    [jobs]
  );

  const applyPatch = async (
    item: JobApplicationSerialized,
    body: { status?: ApplicationStatus; featured?: boolean; cancelRejectionEmail?: boolean },
    options?: { removeFromList?: boolean; successMessage?: string }
  ) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/applications/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { application?: JobApplicationSerialized; error?: string };
      if (!res.ok || !json.application) {
        throw new Error(json.error || "Could not update application.");
      }
      const next = json.application;
      const shouldRemove =
        options?.removeFromList ||
        (status === "favorite" && !next.featured) ||
        (!isRejectedTab && next.status === "rejected") ||
        (isRejectedTab && next.status !== "rejected");
      if (shouldRemove) {
        setItems((prev) => prev.filter((row) => row.id !== item.id));
        setActive((prev) => (prev?.id === item.id ? null : prev));
      } else {
        setItems((prev) => prev.map((row) => (row.id === item.id ? next : row)));
        setActive((prev) => (prev?.id === item.id ? next : prev));
      }
      if (options?.successMessage) {
        message.success(options.successMessage);
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const markReviewed = (item: JobApplicationSerialized) =>
    applyPatch(item, { status: item.status === "reviewed" ? "new" : "reviewed" });

  const toggleFeatured = (item: JobApplicationSerialized) =>
    applyPatch(item, { featured: !item.featured });

  const rejectApplication = (item: JobApplicationSerialized) => {
    Modal.confirm({
      title: "Reject this application?",
      content: `Move ${item.firstName} ${item.lastName} to Rejected? A rejection email will be sent automatically in 7 days unless you cancel.`,
      okText: "Reject",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () =>
        applyPatch(item, { status: "rejected", featured: false }, { successMessage: "Application rejected. Email scheduled in 7 days." }),
    });
  };

  const cancelRejection = (item: JobApplicationSerialized) => {
    Modal.confirm({
      title: "Cancel rejection?",
      content: `Restore ${item.firstName} ${item.lastName} to the Applications inbox and cancel the scheduled rejection email?`,
      okText: "Cancel rejection",
      cancelText: "Keep rejected",
      onOk: () =>
        applyPatch(item, { status: "new" }, { successMessage: "Rejection cancelled. Candidate restored." }),
    });
  };

  const cancelRejectionEmailOnly = (item: JobApplicationSerialized) => {
    Modal.confirm({
      title: "Cancel rejection email?",
      content: `Keep ${item.firstName} ${item.lastName} rejected, but do not send the automatic rejection email?`,
      okText: "Cancel email",
      cancelText: "Keep schedule",
      onOk: () =>
        applyPatch(
          item,
          { cancelRejectionEmail: true },
          { successMessage: "Scheduled rejection email cancelled." }
        ),
    });
  };

  const deleteApplication = (item: JobApplicationSerialized) => {
    Modal.confirm({
      title: "Delete this application?",
      content: `Remove ${item.firstName} ${item.lastName}'s application for ${item.jobTitle || "this role"}? This cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const res = await fetch(`/api/admin/applications/${item.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          throw new Error(json.error || "Could not delete application.");
        }
        setItems((prev) => prev.filter((row) => row.id !== item.id));
        setActive((prev) => (prev?.id === item.id ? null : prev));
        message.success("Application deleted.");
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Input
          allowClear
          prefix={<Search className="h-4 w-4 text-slate-400" />}
          placeholder="Search name, email, phone, role, or answers"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="lg:max-w-sm"
        />
        <Select
          value={jobId}
          onChange={(value) => {
            setJobId(value == null ? "all" : String(value));
            setQuestionId("all");
            setAnswerQuery("");
          }}
          options={jobOptions}
          className="lg:w-64"
          placeholder="Filter by role"
        />
        {!isRejectedTab && (
          <Select
            value={status}
            onChange={setStatus}
            className="lg:w-40"
            options={[
              { label: "All statuses", value: "all" },
              { label: "New", value: "new" },
              { label: "Reviewed", value: "reviewed" },
              { label: "Favorite", value: "favorite" },
            ]}
          />
        )}
        {(selectedJob?.questions?.length ?? 0) > 0 && (
          <Select
            value={questionId}
            onChange={setQuestionId}
            options={questionOptions}
            className="lg:w-72"
            placeholder="Filter by question"
          />
        )}
        <Input
          allowClear
          placeholder="Filter by answer"
          value={answerQuery}
          onChange={(event) => setAnswerQuery(event.target.value)}
          className="lg:max-w-xs"
        />
        <Button onClick={() => void load()} loading={loading}>
          Refresh
        </Button>
      </div>

      {loading && items.length === 0 ? (
        <div className="flex items-center gap-2 py-12 text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading {isRejectedTab ? "rejected candidates" : "applications"}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
          {isRejectedTab
            ? "No rejected candidates match these filters."
            : "No applications match these filters."}
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Card key={item.id} size="small" className="rounded-xl border-slate-200/90 shadow-xs">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {item.firstName} {item.lastName}
                    </span>
                    {statusTag(item.status)}
                    {item.featured && <Tag color="gold">Favorite</Tag>}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.jobTitle}</p>
                  <p className="text-xs text-slate-400">
                    {item.email} · {item.phone} · {formatPostedAgo(item.createdAt)}
                  </p>
                  {isRejectedTab && (
                    <p className="mt-1 text-xs font-medium text-amber-700">
                      {rejectionEmailLabel(item, nowMs)}
                    </p>
                  )}
                  {(item.answers?.length ?? 0) > 0 && (
                    <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
                      {(item.answers ?? []).map((answer, index) => (
                        <p key={`${item.id}-${answer.questionId || index}`} className="text-xs text-slate-600">
                          <span className="font-medium text-slate-700">{answer.question}: </span>
                          <span className="text-slate-500">{answer.answer}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <Space wrap>
                  {!isRejectedTab && (
                    <Button
                      type="text"
                      aria-label={item.featured ? "Remove favorite" : "Mark as favorite"}
                      icon={
                        <Star
                          className={`h-4 w-4 ${
                            item.featured ? "fill-amber-400 text-amber-400" : "text-slate-400"
                          }`}
                        />
                      }
                      onClick={() => void toggleFeatured(item)}
                      loading={saving && active?.id === item.id}
                    />
                  )}
                  {item.resumeUrl && (
                    <Button href={item.resumeUrl} target="_blank" icon={<Download className="h-4 w-4" />}>
                      CV
                    </Button>
                  )}
                  <Button type="primary" icon={<Eye className="h-4 w-4" />} onClick={() => setActive(item)}>
                    View
                  </Button>
                  {isRejectedTab ? (
                    <>
                      <Button
                        icon={<RotateCcw className="h-4 w-4" />}
                        onClick={() => cancelRejection(item)}
                        loading={saving && active?.id === item.id}
                      >
                        Cancel rejection
                      </Button>
                      {item.rejectionEmailAt && !item.rejectionEmailSentAt && (
                        <Button onClick={() => cancelRejectionEmailOnly(item)}>
                          Cancel email
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      icon={<UserX className="h-4 w-4" />}
                      onClick={() => rejectApplication(item)}
                      loading={saving && active?.id === item.id}
                    >
                      Reject
                    </Button>
                  )}
                  <Button
                    danger
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => deleteApplication(item)}
                  >
                    Delete
                  </Button>
                </Space>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        title={active ? `${active.firstName} ${active.lastName}` : "Application"}
        size={520}
        open={!!active}
        onClose={() => setActive(null)}
        destroyOnHidden
      >
        {active && (
          <div className="space-y-5 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              {statusTag(active.status)}
              {active.featured && <Tag color="gold">Favorite</Tag>}
              <Text type="secondary">{formatPostedAgo(active.createdAt)}</Text>
            </div>
            {isRejectedTab && (
              <section className="rounded-lg border border-amber-100 bg-amber-50/70 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-amber-700/80">Rejection email</p>
                <p className="mt-1 font-medium text-amber-900">{rejectionEmailLabel(active, nowMs)}</p>
                {active.rejectionEmailAt && !active.rejectionEmailSentAt && (
                  <p className="mt-1 text-xs text-amber-800/80">
                    Scheduled for {new Date(active.rejectionEmailAt).toLocaleString()}
                  </p>
                )}
              </section>
            )}
            <section>
              <p className="text-xs uppercase tracking-wide text-slate-400">Role</p>
              <p className="font-medium text-slate-900">{active.jobTitle}</p>
            </section>
            <section className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
                <a className="text-cyan-700" href={`mailto:${active.email}`}>
                  {active.email}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Phone</p>
                <a className="text-cyan-700" href={`tel:${active.phone}`}>
                  {active.phone}
                </a>
              </div>
            </section>
            <section>
              <p className="text-xs uppercase tracking-wide text-slate-400">Address</p>
              <p>{active.address || "—"}</p>
            </section>
            <section className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">LinkedIn</p>
                {active.linkedin ? (
                  <a className="break-all text-cyan-700" href={active.linkedin} target="_blank" rel="noreferrer">
                    {active.linkedin}
                  </a>
                ) : (
                  <p>—</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Website</p>
                {active.website ? (
                  <a className="break-all text-cyan-700" href={active.website} target="_blank" rel="noreferrer">
                    {active.website}
                  </a>
                ) : (
                  <p>—</p>
                )}
              </div>
            </section>
            <section>
              <p className="text-xs uppercase tracking-wide text-slate-400">Cover letter</p>
              <p className="whitespace-pre-wrap text-slate-700">{active.coverLetter || "—"}</p>
            </section>
            {(active.answers?.length ?? 0) > 0 && (
              <section className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Screening questions</p>
                {(active.answers ?? []).map((answer, index) => (
                  <div key={`${active.id}-${answer.questionId || index}`}>
                    <p className="font-medium text-slate-900">{answer.question}</p>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{answer.answer || "—"}</p>
                  </div>
                ))}
              </section>
            )}
            <section>
              <p className="text-xs uppercase tracking-wide text-slate-400">Education</p>
              {active.education.length === 0 ? (
                <p>—</p>
              ) : (
                <ul className="list-disc space-y-1 pl-5">
                  {active.education.map((item, index) => (
                    <li key={`${item.school}-${index}`}>
                      {[item.school, item.degree, item.year].filter(Boolean).join(" — ")}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section>
              <p className="text-xs uppercase tracking-wide text-slate-400">Experience</p>
              {active.experience.length === 0 ? (
                <p>—</p>
              ) : (
                <div className="space-y-3">
                  {active.experience.map((item, index) => (
                    <div key={`${item.company}-${index}`}>
                      <p className="font-medium">
                        {[item.role, item.company].filter(Boolean).join(" · ")}
                      </p>
                      {item.duration && <p className="text-xs text-slate-400">{item.duration}</p>}
                      {item.description && <p className="mt-1 text-slate-600">{item.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>
            <section>
              <p className="text-xs uppercase tracking-wide text-slate-400">CV</p>
              {active.resumeUrl ? (
                <Button href={active.resumeUrl} target="_blank" icon={<Download className="h-4 w-4" />}>
                  {active.resumeName || "Download CV"}
                </Button>
              ) : (
                <p>—</p>
              )}
            </section>
            <Space wrap>
              {!isRejectedTab && (
                <>
                  <Button
                    icon={
                      <Star
                        className={`h-4 w-4 ${
                          active.featured ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                    }
                    loading={saving}
                    onClick={() => void toggleFeatured(active)}
                  >
                    {active.featured ? "Remove favorite" : "Mark as favorite"}
                  </Button>
                  <Button type="primary" loading={saving} onClick={() => void markReviewed(active)}>
                    {active.status === "reviewed" ? "Mark as new" : "Mark as reviewed"}
                  </Button>
                  <Button icon={<UserX className="h-4 w-4" />} onClick={() => rejectApplication(active)}>
                    Reject
                  </Button>
                </>
              )}
              {isRejectedTab && (
                <>
                  <Button
                    type="primary"
                    icon={<RotateCcw className="h-4 w-4" />}
                    loading={saving}
                    onClick={() => cancelRejection(active)}
                  >
                    Cancel rejection
                  </Button>
                  {active.rejectionEmailAt && !active.rejectionEmailSentAt && (
                    <Button onClick={() => cancelRejectionEmailOnly(active)}>Cancel email</Button>
                  )}
                </>
              )}
              <Button
                danger
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => deleteApplication(active)}
              >
                Delete application
              </Button>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
}
