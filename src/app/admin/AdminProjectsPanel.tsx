"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Button, Card, Drawer, Form, Input, Select, Space, Switch, Typography, message } from "antd";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import type { ProjectSerialized } from "@/lib/cms/types";
import { KNOWN_ICON_SLUGS } from "@/lib/cms/icons";
import { AdminImageField } from "./AdminImageField";

const { Text } = Typography;
const { TextArea } = Input;

const iconOptions = KNOWN_ICON_SLUGS.map((s) => ({ label: s, value: s }));

type Props = {
  projects: ProjectSerialized[];
  onChange: (next: ProjectSerialized[]) => void;
  onDirty: () => void;
};

export function AdminProjectsPanel({ projects, onChange, onDirty }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form] = Form.useForm<ProjectSerialized>();

  const openEdit = useCallback(
    (index: number) => {
      const row = projects[index];
      if (!row) return;
      setEditIndex(index);
      form.setFieldsValue({
        ...row,
        hidden: row.hidden ?? false,
        iconSlugs: row.iconSlugs ?? [],
      });
      setDrawerOpen(true);
    },
    [form, projects]
  );

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditIndex(null);
    form.resetFields();
  };

  const applyDrawer = async () => {
    try {
      const v = await form.validateFields();
      if (editIndex == null) return;
      const next = [...projects];
      next[editIndex] = {
        ...next[editIndex],
        ...v,
        iconSlugs: Array.isArray(v.iconSlugs) ? v.iconSlugs : [],
        hidden: Boolean(v.hidden),
      };
      onChange(next);
      onDirty();
      message.success("Updated draft — use Save changes in the header.");
      closeDrawer();
    } catch {
      /* validation */
    }
  };

  const toggleHidden = (index: number) => {
    const next = [...projects];
    const row = next[index];
    if (!row) return;
    next[index] = { ...row, hidden: !row.hidden };
    onChange(next);
    onDirty();
  };

  const removeAt = (index: number) => {
    const next = projects.filter((_, i) => i !== index);
    onChange(next);
    onDirty();
  };

  const addProject = () => {
    const row: ProjectSerialized = {
      title: "New project",
      des: "",
      img: "",
      link: "/portfolio",
      iconSlugs: [],
      hidden: false,
    };
    const next = [...projects, row];
    const idx = next.length - 1;
    onChange(next);
    onDirty();
    setEditIndex(idx);
    form.setFieldsValue({ ...row, hidden: false, iconSlugs: [] });
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text type="secondary" className="!text-slate-500">
          Toggle visibility for the live site. Pencil edits details (save with header button).
        </Text>
        <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={addProject}>
          Add project
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, index) => (
          <Card
            key={p.id ?? `p-${index}-${p.title}`}
            size="small"
            className={`overflow-hidden rounded-xl border shadow-xs transition-opacity ${
              p.hidden ? "border-slate-200/80 opacity-60" : "border-slate-200/90"
            }`}
            styles={{ body: { padding: 0 } }}
          >
            <div className="relative aspect-[16/10] w-full bg-slate-100">
              {p.img ? (
                <Image
                  src={p.img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized={p.img.startsWith("http")}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
              )}
              {p.hidden && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-xs font-medium uppercase tracking-wide text-white">
                  Hidden on site
                </div>
              )}
            </div>
            <div className="space-y-2 p-3">
              <div className="line-clamp-2 text-sm font-semibold text-slate-900">{p.title || "Untitled"}</div>
              <p className="line-clamp-2 text-xs text-slate-500">{p.des || "—"}</p>
              <div className="flex items-center justify-end gap-1 border-t border-slate-100 pt-2">
                <Button
                  type="text"
                  size="small"
                  aria-label={p.hidden ? "Show on site" : "Hide from site"}
                  icon={
                    p.hidden ? (
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
        title={editIndex != null ? `Edit: ${projects[editIndex]?.title || "Project"}` : "Project"}
        size={420}
        open={drawerOpen}
        onClose={closeDrawer}
        destroyOnHidden
        styles={{ body: { paddingBottom: 88 } }}
        footer={
          <Space className="w-full justify-end">
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button type="primary" onClick={() => void applyDrawer()}>
              Apply to draft
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" className="pt-1">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="des" label="Description" rules={[{ required: true }]}>
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item name="img" label="Image" rules={[{ required: true }]}>
            <AdminImageField folder="projects" placeholder="Path or upload" />
          </Form.Item>
          <Form.Item name="link" label="Link" rules={[{ required: true }]}>
            <Input placeholder="/portfolio" />
          </Form.Item>
          <Form.Item name="iconSlugs" label="Tech icons">
            <Select mode="multiple" allowClear options={iconOptions} optionFilterProp="label" />
          </Form.Item>
          <Form.Item name="hidden" label="Hidden on live site" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
