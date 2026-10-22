export async function assertCaptcha(token: string | null | undefined) {
  if (!token?.trim()) {
    throw new Error("Please complete the captcha.");
  }

  const res = await fetch("/api/captcha/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(json.error || "Please complete the captcha.");
  }
}
