/** Marks the last `n` words of a heading for the serif-italic accent used by <SplitText>. */
export function accent(text: string, n = 1) {
  if (text.includes("*")) return text;
  const words = text.trim().split(/\s+/);
  if (words.length <= n) return `*${text}*`;
  const head = words.slice(0, -n).join(" ");
  const tail = words.slice(-n).join(" ");
  // Keep trailing punctuation outside the accent.
  const m = /^(.*?)([.,!?:;)]*)$/.exec(tail);
  return `${head} *${m?.[1] ?? tail}*${m?.[2] ?? ""}`;
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
