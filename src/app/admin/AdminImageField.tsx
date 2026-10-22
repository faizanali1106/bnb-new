"use client";

import { useState } from "react";
import { Button, Input, Space, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { Upload as UploadIcon } from "lucide-react";
import type { UploadFolder } from "@/lib/cms/storage";

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  folder: UploadFolder;
  placeholder?: string;
  disabled?: boolean;
};

/**
 * Text field for URL/path + upload to Supabase (via /api/admin/upload).
 * Stored value is the full public URL when uploaded, or a site path like /projects/x.png.
 */
export function AdminImageField({
  value,
  onChange,
  folder,
  placeholder = "/projects/example.png or upload",
  disabled,
}: Props) {
  const [busy, setBusy] = useState(false);

  const customRequest: UploadProps["customRequest"] = async (options) => {
    const { file, onError, onSuccess } = options;
    if (!(file instanceof File)) {
      onError?.(new Error("Invalid file"));
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      if (data.url) {
        onChange?.(data.url);
        message.success("Image uploaded");
        onSuccess?.(data, new XMLHttpRequest());
      } else {
        throw new Error("No URL returned");
      }
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Upload failed");
      onError?.(e as Error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Space.Compact className="w-full max-w-full">
      <Input
        className="flex-1 min-w-0"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || busy}
        allowClear
      />
      <Upload
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        showUploadList={false}
        customRequest={customRequest}
        disabled={disabled || busy}
      >
        <Button type="default" loading={busy} icon={<UploadIcon className="h-4 w-4" />}>
          Upload
        </Button>
      </Upload>
    </Space.Compact>
  );
}
