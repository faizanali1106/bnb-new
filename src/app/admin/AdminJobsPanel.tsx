"use client";

import { useCallback, useState } from "react";
import { Button, Card, Drawer, Form, Input, Modal, Select, Space, Switch, Typography, message } from "antd";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import type { JobSerialized } from "@/lib/cms/types";
import { formatPostedAgo } from "@/data/jobs";

const { Text } = Typography;
const { TextArea } = Input;

const employmentOptions = [
  { label: "Full-time", value: "Full-time" },
  { label: "Contract", value: "Contract" },
];

const workModeOptions = [
  { label: "Remote", value: "Remote" },
  { label: "Onsite", value: "Onsite" },
  { label: "Hybrid", value: "Hybrid" },
];

type JobFormValues = Omit<
  JobSerialized,
  "responsibilities" | "requirements" | "benefits"
> & {
  responsibilitiesText: string;
  requirementsText: string;
  benefitsText: string;
};

function linesToList(value: string | undefined): string[] {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function listToLines(value: string[] | undefined): string {
  return (value ?? []).join("\n");
}

function newQuestionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeQuestions(
  value: JobSerialized["questions"] | undefined
): JobSerialized["questions"] {
  return (value ?? [])
    .map((question) => ({
      id: String(question?.id || newQuestionId()),
      prompt: String(question?.prompt ?? "").trim(),
    }))
    .filter((question) => question.prompt);
}

function blankJob(): JobSerialized {
  return {
    title: "New role",
    department: "Engineering",
    employmentType: "Full-time",
    workMode: "Hybrid",
    location: "Lahore, Pakistan",
    summary: "",
    about: "",
    responsibilities: [],
    requirements: [],
    benefits: [],
    postedAt: new Date().toISOString().slice(0, 10),
    questions: [],
    hidden: false,
  };
}

type Props = {
  jobs: JobSerialized[];
  onChange: (next: JobSerialized[]) => void;
  onDirty: () => void;
};

export function AdminJobsPanel({ jobs, onChange, onDirty }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form] = Form.useForm<JobFormValues>();

  const openEdit = useCallback(
    (index: number) => {
      const row = jobs[index];
      if (!row) return;
      setEditIndex(index);
      form.setFieldsValue({
        ...row,
        hidden: row.hidden ?? false,
        questions: row.questions ?? [],
        responsibilitiesText: listToLines(row.responsibilities),
        requirementsText: listToLines(row.requirements),
        benefitsText: listToLines(row.benefits),
      });
      setDrawerOpen(true);
    },
    [form, jobs]
  );

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditIndex(null);
    form.resetFields();
  };

  const requestCloseDrawer = () => {
    const isNew = editIndex == null;
    if (!isNew && !form.isFieldsTouched()) {
      closeDrawer();
      return;
    }
    Modal.confirm({
      title: isNew ? "Discard this new job?" : "Discard unsaved edits?",
      content: isNew
        ? "This role has not been added to the draft yet. Close without applying it?"
        : "Your edits will not be applied to the draft.",
      okText: "Discard",
      okButtonProps: { danger: true },
      cancelText: "Keep editing",
      onOk: closeDrawer,
    });
  };

  const jobFromForm = (v: JobFormValues, base: JobSerialized): JobSerialized => ({
    ...base,
    title: v.title,
    department: v.department,
    employmentType: v.employmentType,
    workMode: v.workMode,
    location: v.location,
    summary: v.summary,
    about: v.about,
    postedAt: v.postedAt,
    hidden: Boolean(v.hidden),
    responsibilities: linesToList(v.responsibilitiesText),
    requirements: linesToList(v.requirementsText),
    benefits: linesToList(v.benefitsText),
    questions: normalizeQuestions(v.questions),
  });

  const applyDrawer = async () => {
    try {
      const v = await form.validateFields();
      if (editIndex == null) {
        onChange([...jobs, jobFromForm(v, blankJob())]);
        onDirty();
        message.success("Added to draft — use Save changes in the header.");
        closeDrawer();
        return;
      }
      const next = [...jobs];
      const current = next[editIndex];
      if (!current) return;
      next[editIndex] = jobFromForm(v, current);
      onChange(next);
      onDirty();
      message.success("Updated draft — use Save changes in the header.");
      closeDrawer();
    } catch {
      /* validation */
    }
  };

  const toggleHidden = (index: number) => {
    const next = [...jobs];
    const row = next[index];
    if (!row) return;
    next[index] = { ...row, hidden: !row.hidden };
    onChange(next);
    onDirty();
  };

  const removeAt = (index: number) => {
    const job = jobs[index];
    Modal.confirm({
      title: "Delete this job?",
      content: `"${job?.title || "Untitled"}" will be removed from the draft. Save changes in the header to publish this.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => {
        onChange(jobs.filter((_, i) => i !== index));
        onDirty();
      },
    });
  };

  const addJob = () => {
    const row = blankJob();
    setEditIndex(null);
    form.setFieldsValue({
      ...row,
      hidden: false,
      questions: [],
      responsibilitiesText: "",
      requirementsText: "",
      benefitsText: "",
    });
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text type="secondary" className="!text-slate-500">
          Posted roles appear on /careers. Hide a role to keep the draft without deleting it.
        </Text>
        <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={addJob}>
          Add job
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job, index) => (
          <Card
            key={job.id ?? `draft-${index}-${job.title}`}
            size="small"
            className={`overflow-hidden rounded-xl border shadow-xs transition-opacity ${
              job.hidden ? "border-slate-200/80 opacity-60" : "border-slate-200/90"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="line-clamp-2 text-sm font-semibold text-slate-900">
                    {job.title || "Untitled"}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {job.department} · {job.employmentType} · {job.workMode}
                  </p>
                  <p className="text-xs text-slate-400">{job.location}</p>
                  {job.id != null && (
                    <p className="text-xs text-slate-400">ID {job.id}</p>
                  )}
                </div>
                {job.hidden && (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                    Hidden
                  </span>
                )}
              </div>
              <p className="line-clamp-2 text-xs text-slate-500">{job.summary || "—"}</p>
              <p className="text-xs text-slate-400">{formatPostedAgo(job.postedAt)}</p>
              {(job.questions?.length ?? 0) > 0 && (
                <p className="text-xs text-slate-400">
                  {job.questions?.length} screening{" "}
                  {job.questions?.length === 1 ? "question" : "questions"}
                </p>
              )}
              <div className="flex items-center justify-end gap-1 border-t border-slate-100 pt-2">
                <Button
                  type="text"
                  size="small"
                  aria-label={job.hidden ? "Show on site" : "Hide from site"}
                  icon={
                    job.hidden ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-600" />
                    )
                  }
                  onClick={() => toggleHidden(index)}
                />
                <Button
                  type="text"
                  size="small"
                  aria-label="Edit"
                  icon={<Pencil className="h-4 w-4 text-[#673493]" />}
                  onClick={() => openEdit(index)}
                />
                <Button
                  type="text"
                  size="small"
                  danger
                  aria-label="Remove"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => removeAt(index)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Drawer
        title={
          editIndex != null ? `Edit: ${jobs[editIndex]?.title || "Role"}` : "New role"
        }
        size={480}
        open={drawerOpen}
        onClose={requestCloseDrawer}
        destroyOnHidden
        styles={{ body: { paddingBottom: 88 } }}
        footer={
          <Space className="w-full justify-end">
            <Button onClick={requestCloseDrawer}>Cancel</Button>
            <Button type="primary" onClick={() => void applyDrawer()}>
              Apply to draft
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" className="pt-1">
          <Form.Item name="title" label="Job title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Input placeholder="Engineering" />
          </Form.Item>
          <Form.Item name="employmentType" label="Job type" rules={[{ required: true }]}>
            <Select options={employmentOptions} />
          </Form.Item>
          <Form.Item name="workMode" label="Workplace" rules={[{ required: true }]}>
            <Select options={workModeOptions} />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input placeholder="Lahore, Pakistan" />
          </Form.Item>
          <Form.Item name="postedAt" label="Posted date" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="summary" label="Short summary" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="about" label="About the role" rules={[{ required: true }]}>
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item name="responsibilitiesText" label="Responsibilities (one per line)">
            <TextArea rows={5} placeholder="One bullet per line" />
          </Form.Item>
          <Form.Item name="requirementsText" label="Requirements (one per line)">
            <TextArea rows={5} placeholder="One bullet per line" />
          </Form.Item>
          <Form.Item name="benefitsText" label="Benefits (one per line)">
            <TextArea rows={4} placeholder="One bullet per line" />
          </Form.Item>
          <Form.Item
            label="Screening questions"
            extra="These appear as required fields at the bottom of this job’s application form."
          >
            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <div className="space-y-3">
                  {fields.map((field) => (
                    <div key={field.key} className="flex items-start gap-2">
                      <Form.Item name={[field.name, "id"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "prompt"]}
                        className="mb-0 flex-1"
                        rules={[{ required: true, message: "Enter a question" }]}
                      >
                        <TextArea
                          rows={2}
                          placeholder="e.g. How many years of React experience do you have?"
                        />
                      </Form.Item>
                      <Button
                        type="text"
                        danger
                        aria-label="Remove question"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => remove(field.name)}
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    block
                    icon={<Plus className="h-4 w-4" />}
                    onClick={() => add({ id: newQuestionId(), prompt: "" })}
                  >
                    Add question
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item name="hidden" label="Hidden on live site" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
