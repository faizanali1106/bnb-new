"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input, Spin, Typography, message } from "antd";
import type { SiteContentSerialized } from "@/lib/cms/types";
import AdminDashboard from "./AdminDashboard";

const { Title, Paragraph, Text } = Typography;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  /** Prefetched after login so the dashboard mounts with data (no full-screen loading flash). */
  const [prefetchedCms, setPrefetchedCms] = useState<SiteContentSerialized | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/session", { credentials: "include" });
        if (!r.ok) return;
        let cms: SiteContentSerialized | null = null;
        try {
          const cr = await fetch("/api/site-content", { credentials: "include" });
          if (cr.ok) cms = (await cr.json()) as SiteContentSerialized;
        } catch {
          /* dashboard will load */
        }
        if (!cancelled) {
          setPrefetchedCms(cms);
          setLoggedIn(true);
        }
      } catch {
        /* stay on login */
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      if (!r.ok) {
        message.error("Invalid password or CMS not configured.");
        return;
      }
      let cms: SiteContentSerialized | null = null;
      try {
        const cr = await fetch("/api/site-content", { credentials: "include" });
        if (cr.ok) {
          cms = (await cr.json()) as SiteContentSerialized;
        }
      } catch {
        /* dashboard will retry load */
      }
      setPrefetchedCms(cms);
      setLoggedIn(true);
      message.success("Signed in");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setPrefetchedCms(null);
    setLoggedIn(false);
    message.info("Signed out");
  };

  if (checkingSession) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-slate-50">
        <Card
          className="w-full max-w-[400px] shadow-xs border-slate-200/90 rounded-2xl"
          variant="borderless"
          styles={{ body: { padding: "28px 28px 24px" } }}
        >
          <Title level={3} className="!mt-0 !mb-1 !text-slate-900 !font-semibold tracking-tight">
            CMS
          </Title>
          <Paragraph className="!text-slate-500 !text-sm !mb-6 !mt-0">
            Sign in with <Text code className="!text-xs">CMS_ADMIN_PASSWORD</Text> from your env.
          </Paragraph>
          <Input.Password
            size="large"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={login}
            autoComplete="current-password"
          />
          <Button type="primary" size="large" block className="mt-4 h-11 rounded-lg" loading={loading} onClick={login}>
            Continue
          </Button>
          <div className="mt-5 text-center border-t border-slate-100 pt-5">
            {/* Full page load on purpose: drops admin-only CSS/providers. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="text-sm text-slate-500 hover:text-cyan-700 transition-colors">
              ← Back to site
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return <AdminDashboard initialData={prefetchedCms} onLogout={logout} />;
}
