"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Typography,
  message,
} from "antd";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import type { TeamMemberSerialized } from "@/lib/cms/types";
import { AdminImageField } from "./AdminImageField";

const { Text } = Typography;

const DEPARTMENTS = [
  "Leadership",
  "HR",
  "Engineering",
  "Design",
  "Business Development",
] as const;

type Props = {
  members: TeamMemberSerialized[];
  onChange: (next: TeamMemberSerialized[]) => void;
  onDirty: () => void;
};

export function AdminTeamPanel({ members, onChange, onDirty }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form] = Form.useForm<TeamMemberSerialized>();

  const openEdit = useCallback(
    (index: number) => {
      const row = members[index];
      if (!row) return;
      setEditIndex(index);
      form.setFieldsValue({
        ...row,
        photo: row.photo ?? "",
        gender: row.gender === "female" ? "female" : "male",
        hidden: row.hidden ?? false,
      });
      setDrawerOpen(true);
    },
    [form, members]
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
      const next = [...members];
      next[editIndex] = {
        ...next[editIndex],
        ...v,
        photo: v.photo ?? "",
        gender: v.gender === "female" ? "female" : "male",
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
    const next = [...members];
    const row = next[index];
    if (!row) return;
    next[index] = { ...row, hidden: !row.hidden };
    onChange(next);
    onDirty();
  };

  const removeAt = (index: number) => {
    const next = members.filter((_, i) => i !== index);
    onChange(next);
    onDirty();
  };

  const addMember = () => {
    const row: TeamMemberSerialized = {
      name: "New teammate",
      role: "Software Engineer",
      department: "Engineering",
      photo: "",
      gender: "male",
      hidden: false,
    };
    const next = [...members, row];
    const idx = next.length - 1;
    onChange(next);
    onDirty();
    setEditIndex(idx);
    form.setFieldsValue({ ...row });
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text type="secondary" className="!text-slate-500">
          Leadership shows on the top row of About. Below: HR, then Engineering →
          Business Development → Design (by seniority within each). Save with the
          header button.
        </Text>
        <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={addMember}>
          Add member
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((m, index) => {
          const photo =
            m.photo?.trim() ||
            (m.gender === "female"
              ? "/media/female-avatar.png"
              : "/media/male-avatar.png");
          return (
            <Card
              key={m.id ?? `team-${index}-${m.name}`}
              size="small"
              className={`overflow-hidden rounded-xl border shadow-xs transition-opacity ${
                m.hidden ? "border-slate-200/80 opacity-60" : "border-slate-200/90"
              }`}
              styles={{ body: { padding: 0 } }}
            >
              <div className="relative aspect-square bg-slate-100">
                <Image
                  src={photo}
                  alt={m.name}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              </div>
              <div className="space-y-1 p-3">
                <div className="font-semibold text-slate-900">{m.name}</div>
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  {m.role}
                </div>
                <div className="text-xs text-slate-400">{m.department}</div>
                <Space wrap className="!mt-2">
                  <Button
                    size="small"
                    icon={<Pencil className="h-3.5 w-3.5" />}
                    onClick={() => openEdit(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    icon={
                      m.hidden ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )
                    }
                    onClick={() => toggleHidden(index)}
                  >
                    {m.hidden ? "Show" : "Hide"}
                  </Button>
                  <Button
                    size="small"
                    danger
                    icon={<Trash2 className="h-3.5 w-3.5" />}
                    onClick={() => removeAt(index)}
                  />
                </Space>
              </div>
            </Card>
          );
        })}
      </div>

      <Drawer
        title={editIndex != null ? "Edit team member" : "Team member"}
        open={drawerOpen}
        onClose={closeDrawer}
        size={420}
        destroyOnHidden
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button type="primary" onClick={() => void applyDrawer()}>
              Apply
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Title / role"
            name="role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Department is required" }]}
          >
            <Select
              options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
            />
          </Form.Item>
          <Form.Item label="Photo" name="photo">
            <AdminImageField folder="team" placeholder="/team-images/... or upload" />
          </Form.Item>
          <Form.Item
            label="Avatar gender (fallback if no photo)"
            name="gender"
            initialValue="male"
          >
            <Select
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Hidden on site" name="hidden" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
