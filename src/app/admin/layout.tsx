import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AdminShell from "./AdminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: "CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <AdminShell>{children}</AdminShell>
    </AntdRegistry>
  );
}
