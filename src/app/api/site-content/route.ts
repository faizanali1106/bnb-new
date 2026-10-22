import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CMS_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/cms/auth-cookie";
import { DEFAULT_SITE_CONTENT } from "@/lib/cms/defaults";
import { loadMergedSiteContent } from "@/lib/cms/load-from-supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await loadMergedSiteContent();
    const admin = verifyAdminSessionCookie((await cookies()).get(CMS_COOKIE_NAME)?.value);
    const payload = admin
      ? data
      : {
          ...data,
          projects: data.projects.filter((p) => !p.hidden),
          jobs: (data.jobs ?? []).filter((j) => !j.hidden),
        };
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (e) {
    console.error("[api/site-content]", e);
    return NextResponse.json(DEFAULT_SITE_CONTENT);
  }
}
