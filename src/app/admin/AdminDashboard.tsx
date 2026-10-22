"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  Switch,
  Typography,
  message,
} from "antd";
import type { JobSerialized, ProjectSerialized, SiteContentSerialized, SiteSettings, TeamMemberSerialized } from "@/lib/cms/types";
import { KNOWN_ICON_SLUGS } from "@/lib/cms/icons";
import { AdminImageField } from "./AdminImageField";
import { AdminProjectsPanel } from "./AdminProjectsPanel";
import { AdminJobsPanel } from "./AdminJobsPanel";
import { AdminApplicationsPanel } from "./AdminApplicationsPanel";
import { AdminTeamPanel } from "./AdminTeamPanel";

const { Paragraph } = Typography;
const { TextArea } = Input;

const iconOptions = KNOWN_ICON_SLUGS.map((s) => ({ label: s, value: s }));

async function putContent(body: SiteContentSerialized) {
  const r = await fetch("/api/admin/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(typeof err?.error === "string" ? err.error : "Save failed");
  }
}

type TabKey =
  | "settings"
  | "projects"
  | "testimonials"
  | "workExperience"
  | "gridItems"
  | "companies"
  | "socialMedia"
  | "jobs"
  | "applications"
  | "rejected"
  | "team";

const NAV: { key: TabKey; label: string }[] = [
  { key: "settings", label: "Stats & site" },
  { key: "projects", label: "Projects" },
  { key: "jobs", label: "Jobs" },
  { key: "applications", label: "Applications" },
  { key: "rejected", label: "Rejected" },
  { key: "team", label: "Team" },
  { key: "testimonials", label: "Testimonials" },
  { key: "workExperience", label: "Services" },
  { key: "gridItems", label: "About grid" },
  { key: "companies", label: "Client logos" },
  { key: "socialMedia", label: "Social links" },
];

export default function AdminDashboard({
  onLogout,
  initialData = null,
}: {
  onLogout: () => void;
  initialData?: SiteContentSerialized | null;
}) {
  const [cms, setCms] = useState<SiteContentSerialized | null>(() => initialData ?? null);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [active, setActive] = useState<TabKey>("settings");
  const [dirty, setDirty] = useState(false);
  const [projectsDraft, setProjectsDraft] = useState<ProjectSerialized[]>([]);
  const [jobsDraft, setJobsDraft] = useState<JobSerialized[]>([]);
  const [teamDraft, setTeamDraft] = useState<TeamMemberSerialized[]>([]);

  const [settingsForm] = Form.useForm();
  const [testimonialsForm] = Form.useForm();
  const [workForm] = Form.useForm();
  const [gridForm] = Form.useForm();
  const [companiesForm] = Form.useForm();
  const [socialForm] = Form.useForm();

  const applyFormsFromData = useCallback((data: SiteContentSerialized) => {
    settingsForm.setFieldsValue(data.settings);
    testimonialsForm.setFieldsValue({ testimonials: data.testimonials });
    workForm.setFieldsValue({ workExperience: data.workExperience });
    gridForm.setFieldsValue({ gridItems: data.gridItems });
    companiesForm.setFieldsValue({ companies: data.companies });
    socialForm.setFieldsValue({
      socialMedia: data.socialMedia.map((s) => ({
        ...s,
        useLucideMail: Boolean(s.useLucideMail),
      })),
    });
  }, [companiesForm, gridForm, settingsForm, socialForm, testimonialsForm, workForm]);

  useEffect(() => {
    if (!cms) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate forms from prefetched data
    setProjectsDraft(
      cms.projects.map((p) => ({
        ...p,
        hidden: p.hidden ?? false,
        iconSlugs: Array.isArray(p.iconSlugs) ? p.iconSlugs : [],
      })),
    );
    setJobsDraft(
      (cms.jobs ?? []).map((j) => ({
        ...j,
        hidden: j.hidden ?? false,
        responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities : [],
        requirements: Array.isArray(j.requirements) ? j.requirements : [],
        benefits: Array.isArray(j.benefits) ? j.benefits : [],
        questions: Array.isArray(j.questions) ? j.questions : [],
      })),
    );
    setTeamDraft(
      (cms.teamMembers ?? []).map((m) => ({
        ...m,
        photo: m.photo ?? "",
        gender: m.gender === "female" ? "female" : "male",
        hidden: m.hidden ?? false,
      })),
    );
  }, [cms]);

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/site-content");
      const data = (await r.json()) as SiteContentSerialized;
      setCms(data);
      applyFormsFromData(data);
      setDirty(false);
    } catch {
      message.error("Could not load content.");
    } finally {
      setLoading(false);
      setBooting(false);
    }
  }, [applyFormsFromData]);

  useLayoutEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate forms from prefetched data
      setCms(initialData);
      applyFormsFromData(initialData);
      setDirty(false);
      setBooting(false);
      return;
    }
    void loadContent();
    // Intentionally mount-only: initialData is fixed for this mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seed = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/seed", {
        method: "POST",
        credentials: "include",
      });
      const j = await r.json();
      if (!r.ok) {
        message.error(typeof j?.error === "string" ? j.error : "Seed failed");
        return;
      }
      if (j.skipped) message.warning(j.message ?? "Already seeded");
      else message.success("Seeded from built-in defaults.");
      await loadContent();
    } finally {
      setLoading(false);
    }
  };

  const save = async (updater: (base: SiteContentSerialized) => SiteContentSerialized) => {
    if (!cms) return;
    setLoading(true);
    try {
      const base: SiteContentSerialized = {
        ...cms,
        teamMembers: cms.teamMembers ?? teamDraft,
        jobs: cms.jobs ?? jobsDraft,
      };
      const next = updater(base);
      await putContent(next);
      message.success("Saved.");
      await loadContent();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };


  async function saveCurrentSection() {
    if (!cms) return;
    try {
      switch (active) {
        case "settings": {
          const v = await settingsForm.validateFields();
          await save((base) => ({ ...base, settings: v }));
          break;
        }
        case "projects": {
          await save((base) => ({
            ...base,
            projects: projectsDraft.map((p) => ({
              ...p,
              iconSlugs: Array.isArray(p.iconSlugs) ? p.iconSlugs : [],
              hidden: Boolean(p.hidden),
            })),
          }));
          break;
        }
        case "jobs": {
          await save((base) => ({
            ...base,
            jobs: jobsDraft.map((j) => ({
              ...j,
              hidden: Boolean(j.hidden),
              responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities : [],
              requirements: Array.isArray(j.requirements) ? j.requirements : [],
              benefits: Array.isArray(j.benefits) ? j.benefits : [],
              questions: Array.isArray(j.questions)
                ? j.questions.filter((question) => question.prompt?.trim())
                : [],
            })),
          }));
          break;
        }
        case "team": {
          await save((base) => ({
            ...base,
            teamMembers: teamDraft.map((m) => ({
              ...m,
              photo: m.photo ?? "",
              gender: m.gender === "female" ? "female" : "male",
              hidden: Boolean(m.hidden),
            })),
          }));
          break;
        }
        case "testimonials": {
          const v = await testimonialsForm.validateFields();
          const testimonials = (v.testimonials as SiteContentSerialized["testimonials"]).map((t) => ({ ...t, title: t.title ?? "" }));
          await save((base) => ({ ...base, testimonials }));
          break;
        }
        case "workExperience": {
          const v = await workForm.validateFields();
          await save((base) => ({ ...base, workExperience: v.workExperience }));
          break;
        }
        case "gridItems": {
          const v = await gridForm.validateFields();
          const normalized = (v.gridItems as SiteContentSerialized["gridItems"]).map((row) => ({ ...row, id: Number(row.id) || 1 }));
          await save((base) => ({ ...base, gridItems: normalized }));
          break;
        }
        case "companies": {
          const v = await companiesForm.validateFields();
          await save((base) => ({ ...base, companies: v.companies }));
          break;
        }
        case "socialMedia": {
          const v = await socialForm.validateFields();
          const socialMedia = (v.socialMedia as SiteContentSerialized["socialMedia"]).map((s) => ({
            ...s,
            img: s.img ?? "",
            display: s.display ?? undefined,
            useLucideMail: Boolean(s.useLucideMail),
          }));
          await save((base) => ({ ...base, socialMedia }));
          break;
        }
        default:
          break;
      }
    } catch (e: unknown) {
      if (e && typeof e === "object" && "errorFields" in e) return;
      message.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!cms) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <Paragraph className="!text-slate-600">Could not load content.</Paragraph>
        <Button
          type="primary"
          onClick={() => {
            setBooting(true);
            void loadContent();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-slate-100/90 lg:flex-row">
      <aside className="hidden h-full w-52 shrink-0 flex-col border-r border-slate-200/90 bg-white lg:flex">
        <div className="border-b border-slate-100 px-3 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sections</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {NAV.map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => setActive(n.key)}
              className={
                active === n.key
                  ? "rounded-lg bg-cyan-50 px-3 py-2.5 text-left text-sm font-medium text-cyan-900"
                  : "rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              }
            >
              {n.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-slate-200/90 bg-white lg:hidden">
          <div className="px-3 py-2.5">
            <Select
              value={active}
              onChange={(v) => setActive(v as TabKey)}
              options={NAV.map((n) => ({ label: n.label, value: n.key }))}
              className="w-full"
              size="large"
              aria-label="Section"
            />
          </div>
        </div>

        <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200/90 bg-white/95 px-3 py-2.5 backdrop-blur-xs lg:px-5">
          <span className="min-w-0 flex-1 text-sm font-medium text-slate-800 lg:text-base">
            {NAV.find((n) => n.key === active)?.label}
          </span>
          <Space wrap size="small" className="justify-end">
            <Button size="small" loading={loading} onClick={() => void loadContent()}>
              Refresh
            </Button>
            <Button size="small" onClick={() => void seed()}>
              Seed if empty
            </Button>
            <Button
              type="primary"
              size="small"
              loading={loading}
              disabled={!dirty || active === "applications" || active === "rejected"}
              onClick={() => void saveCurrentSection()}
            >
              Save changes
            </Button>
            <Button size="small" danger type="text" className="!text-red-600" onClick={onLogout}>
              Log out
            </Button>
            {/* Full page load on purpose: drops admin-only CSS/providers. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-cyan-800"
            >
              View site →
            </a>
          </Space>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50/50 px-4 py-5 lg:px-8 lg:py-8">
          {active === "settings" && (
            <Form
              form={settingsForm}
              layout="vertical"
              className="max-w-3xl"
              onValuesChange={() => setDirty(true)}
            >
              <Divider titlePlacement="start">Home page stats</Divider>
              <Form.List name="homeStats">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...rest }) => (
                      <Card
                        size="small"
                        key={key}
                        className="mb-3 rounded-xl border border-slate-200/90 bg-white shadow-xs"
                        title={`Stat ${name + 1}`}
                        extra={
                          <Button type="link" danger onClick={() => remove(name)}>
                            Remove
                          </Button>
                        }
                      >
                        <Space wrap className="w-full">
                          <Form.Item
                            {...rest}
                            label="Value"
                            name={[name, "value"]}
                            rules={[{ required: true, message: "Required" }]}
                            className="min-w-[140px] flex-1"
                          >
                            <Input placeholder="300+" />
                          </Form.Item>
                          <Form.Item
                            {...rest}
                            label="Label"
                            name={[name, "label"]}
                            rules={[{ required: true, message: "Required" }]}
                            className="min-w-[200px] flex-1"
                          >
                            <Input placeholder="Projects Delivered" />
                          </Form.Item>
                        </Space>
                      </Card>
                    ))}
                    <Button type="dashed" block onClick={() => add({ value: "", label: "" })} className="mb-4">
                      Add home stat
                    </Button>
                  </>
                )}
              </Form.List>

              <Divider titlePlacement="start">Portfolio page stats</Divider>
              <Form.List name="portfolioStats">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...rest }) => (
                      <Card
                        size="small"
                        key={key}
                        className="mb-3 rounded-xl border border-slate-200/90 bg-white shadow-xs"
                        title={`Stat ${name + 1}`}
                        extra={
                          <Button type="link" danger onClick={() => remove(name)}>
                            Remove
                          </Button>
                        }
                      >
                        <Space wrap className="w-full">
                          <Form.Item
                            {...rest}
                            label="Value"
                            name={[name, "value"]}
                            rules={[{ required: true }]}
                            className="min-w-[140px] flex-1"
                          >
                            <Input placeholder="8+" />
                          </Form.Item>
                          <Form.Item
                            {...rest}
                            label="Label"
                            name={[name, "label"]}
                            rules={[{ required: true }]}
                            className="min-w-[200px] flex-1"
                          >
                            <Input placeholder="PROJECTS" />
                          </Form.Item>
                        </Space>
                      </Card>
                    ))}
                    <Button type="dashed" block onClick={() => add({ value: "", label: "" })} className="mb-4">
                      Add portfolio stat
                    </Button>
                  </>
                )}
              </Form.List>

              <Divider titlePlacement="start">WhatsApp widget</Divider>
              <Form.Item label="Phone (with country code)" name={["whatsapp", "phone"]} rules={[{ required: true }]}>
                <Input placeholder="+923357733547" />
              </Form.Item>
              <Form.Item label="Business name" name={["whatsapp", "businessName"]} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Default message" name={["whatsapp", "defaultMessage"]} rules={[{ required: true }]}>
                <TextArea rows={3} />
              </Form.Item>

              <Divider titlePlacement="start">Footer</Divider>
              <Form.Item label="Company blurb" name="footerTagline" rules={[{ required: true }]}>
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          )}

          {active === "projects" && (
            <AdminProjectsPanel
              projects={projectsDraft}
              onChange={setProjectsDraft}
              onDirty={() => setDirty(true)}
            />
          )}

          {active === "jobs" && (
            <AdminJobsPanel
              jobs={jobsDraft}
              onChange={setJobsDraft}
              onDirty={() => setDirty(true)}
            />
          )}

          {active === "applications" && <AdminApplicationsPanel jobs={jobsDraft} mode="inbox" />}

          {active === "rejected" && <AdminApplicationsPanel jobs={jobsDraft} mode="rejected" />}

          {active === "team" && (
            <AdminTeamPanel
              members={teamDraft}
              onChange={setTeamDraft}
              onDirty={() => setDirty(true)}
            />
          )}

          {active === "testimonials" && (
            <Form form={testimonialsForm} layout="vertical" onValuesChange={() => setDirty(true)}>
              <Form.List name="testimonials">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...rest }) => (
                      <Card
                        size="small"
                        key={key}
                        className="mb-4 rounded-xl border border-slate-200/90 bg-white shadow-xs"
                        title={`Testimonial ${name + 1}`}
                        extra={
                          <Button type="link" danger onClick={() => remove(name)}>
                            Remove
                          </Button>
                        }
                      >
                        <Form.Item {...rest} label="Quote" name={[name, "quote"]} rules={[{ required: true }]}>
                          <TextArea rows={5} />
                        </Form.Item>
                        <Form.Item {...rest} label="Name" name={[name, "name"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...rest} label="Company / role" name={[name, "title"]}>
                          <Input placeholder="Optional" />
                        </Form.Item>
                      </Card>
                    ))}
                    <Button type="dashed" block className="mb-4" onClick={() => add({ quote: "", name: "", title: "" })}>
                      Add testimonial
                    </Button>
                  </>
                )}
              </Form.List>
            </Form>
          )}

          {active === "workExperience" && (
            <Form form={workForm} layout="vertical" onValuesChange={() => setDirty(true)}>
              <Form.List name="workExperience">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...rest }) => (
                      <Card
                        size="small"
                        key={key}
                        className="mb-4 rounded-xl border border-slate-200/90 bg-white shadow-xs"
                        title={`Card ${name + 1}`}
                        extra={
                          <Button type="link" danger onClick={() => remove(name)}>
                            Remove
                          </Button>
                        }
                      >
                        <Form.Item {...rest} label="Title" name={[name, "title"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...rest} label="Description" name={[name, "desc"]} rules={[{ required: true }]}>
                          <TextArea rows={3} />
                        </Form.Item>
                        <Form.Item
                          {...rest}
                          label="Grid column class"
                          name={[name, "className"]}
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="md:col-span-2" />
                        </Form.Item>
                        <Form.Item {...rest} label="Thumbnail" name={[name, "thumbnail"]} rules={[{ required: true }]}>
                          <AdminImageField folder="work" placeholder="/exp1.svg or upload" />
                        </Form.Item>
                      </Card>
                    ))}
                    <Button
                      type="dashed"
                      block
                      className="mb-4"
                      onClick={() =>
                        add({
                          title: "",
                          desc: "",
                          className: "md:col-span-2",
                          thumbnail: "/exp1.svg",
                        })
                      }
                    >
                      Add service card
                    </Button>
                  </>
                )}
              </Form.List>
            </Form>
          )}

          {active === "gridItems" && (
            <Form form={gridForm} layout="vertical" onValuesChange={() => setDirty(true)}>
              <Form.List name="gridItems">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...rest }) => (
                      <Card
                        size="small"
                        key={key}
                        className="mb-4 rounded-xl border border-slate-200/90 bg-white shadow-xs"
                        title={`Grid item ${name + 1}`}
                        extra={
                          <Button type="link" danger onClick={() => remove(name)}>
                            Remove
                          </Button>
                        }
                      >
                        <Form.Item {...rest} label="ID (layout key)" name={[name, "id"]} rules={[{ required: true }]}>
                          <InputNumber className="w-full" min={1} step={1} />
                        </Form.Item>
                        <Form.Item {...rest} label="Title" name={[name, "title"]} rules={[{ required: true }]}>
                          <TextArea rows={2} />
                        </Form.Item>
                        <Form.Item {...rest} label="Subtitle / description" name={[name, "description"]}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...rest} label="Cell CSS classes" name={[name, "className"]} rules={[{ required: true }]}>
                          <TextArea rows={2} placeholder="Tailwind grid classes" />
                        </Form.Item>
                        <Form.Item {...rest} label="Image" name={[name, "img"]}>
                          <AdminImageField folder="grid" placeholder="/b1.jpg or upload" />
                        </Form.Item>
                        <Form.Item {...rest} label="Image CSS classes" name={[name, "imgClassName"]}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...rest} label="Title CSS classes" name={[name, "titleClassName"]}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...rest} label="Spare image" name={[name, "spareImg"]}>
                          <AdminImageField folder="grid" placeholder="Optional image or upload" />
                        </Form.Item>
                      </Card>
                    ))}
                    <Button
                      type="dashed"
                      block
                      className="mb-4"
                      onClick={() =>
                        add({
                          id: (gridForm.getFieldValue("gridItems")?.length ?? 0) + 1,
                          title: "",
                          description: "",
                          className: "md:col-span-2",
                          img: "",
                          imgClassName: "",
                          titleClassName: "",
                          spareImg: "",
                        })
                      }
                    >
                      Add grid item
                    </Button>
                  </>
                )}
              </Form.List>
            </Form>
          )}

          {active === "companies" && (
            <Form form={companiesForm} layout="vertical" onValuesChange={() => setDirty(true)}>
              <Form.List name="companies">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...rest }) => (
                      <Card
                        size="small"
                        key={key}
                        className="mb-4 rounded-xl border border-slate-200/90 bg-white shadow-xs"
                        title={`Logo ${name + 1}`}
                        extra={
                          <Button type="link" danger onClick={() => remove(name)}>
                            Remove
                          </Button>
                        }
                      >
                        <Form.Item {...rest} label="Name (internal)" name={[name, "name"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...rest} label="Icon image" name={[name, "img"]} rules={[{ required: true }]}>
                          <AdminImageField folder="companies" placeholder="/cloud.svg or upload" />
                        </Form.Item>
                        <Form.Item {...rest} label="Wordmark image" name={[name, "nameImg"]} rules={[{ required: true }]}>
                          <AdminImageField folder="companies" placeholder="/cloudName.svg or upload" />
                        </Form.Item>
                      </Card>
                    ))}
                    <Button type="dashed" block className="mb-4" onClick={() => add({ name: "", img: "", nameImg: "" })}>
                      Add company logo
                    </Button>
                  </>
                )}
              </Form.List>
            </Form>
          )}

          {active === "socialMedia" && (
            <Form form={socialForm} layout="vertical" onValuesChange={() => setDirty(true)}>
              <Form.List name="socialMedia">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...rest }) => (
                      <Card
                        size="small"
                        key={key}
                        className="mb-4 rounded-xl border border-slate-200/90 bg-white shadow-xs"
                        title={`Link ${name + 1}`}
                        extra={
                          <Button type="link" danger onClick={() => remove(name)}>
                            Remove
                          </Button>
                        }
                      >
                        <Form.Item {...rest} label="Label" name={[name, "name"]} rules={[{ required: true }]}>
                          <Input placeholder="LinkedIn" />
                        </Form.Item>
                        <Form.Item {...rest} label="URL" name={[name, "url"]} rules={[{ required: true }]}>
                          <Input placeholder="https://..." />
                        </Form.Item>
                        <Form.Item {...rest} label="Image (optional if Lucide mail)" name={[name, "img"]}>
                          <AdminImageField folder="social" placeholder="/link.svg or upload" />
                        </Form.Item>
                        <Form.Item {...rest} label="Display text (e.g. email)" name={[name, "display"]}>
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...rest}
                          label="Use mail icon (email row)"
                          name={[name, "useLucideMail"]}
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                      </Card>
                    ))}
                    <Button
                      type="dashed"
                      block
                      className="mb-4"
                      onClick={() =>
                        add({
                          name: "",
                          img: "",
                          url: "",
                          display: "",
                          useLucideMail: false,
                        })
                      }
                    >
                      Add social link
                    </Button>
                  </>
                )}
              </Form.List>
            </Form>
          )}
        </main>
      </div>
    </div>
  );
}
