"use client";

import { ConfigProvider, theme } from "antd";

/**
 * Admin is always light UI: isolates from site `dark` class on <html> and
 * pins Ant Design to the default (light) theme.
 */
export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorBgLayout: "#f4f6f8",
          colorBgContainer: "#ffffff",
          colorText: "rgba(15, 23, 42, 0.92)",
          colorTextSecondary: "rgba(15, 23, 42, 0.58)",
          colorBorder: "#e8ecf0",
          colorPrimary: "#673493",
          borderRadius: 10,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Card: { colorBorderSecondary: "#e8ecf0", paddingLG: 20 },
          Tabs: { horizontalMargin: "0", titleFontSize: 13 },
          Button: { controlHeightLG: 42 },
        },
      }}
    >
      <div
        className="min-h-screen bg-[#f4f6f8] text-slate-900 antialiased [color-scheme:light]"
        data-admin-ui
        data-lenis-prevent
      >
        {children}
      </div>
    </ConfigProvider>
  );
}
