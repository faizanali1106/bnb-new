import { useId } from "react";

type Props = { tone?: "light" | "dark"; className?: string };

// Circuit traces feeding the Bit & Bytes diamond: [startX, y, endX]
const TRACES: [number, number, number][] = [
  [70, 150, 575],
  [150, 263, 330],
  [40, 350, 390],
  [130, 437, 330],
  [70, 550, 575],
];

/** Large animated rendition of the Bit & Bytes mark: a diamond fed by data traces. */
export default function CircuitMark({ tone = "light", className }: Props) {
  const id = useId().replace(/:/g, "");
  const dark = tone === "dark";

  return (
    <svg className={className} viewBox="0 0 900 700" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`dia-${id}`} x1="380" y1="80" x2="820" y2="620" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={dark ? "#3d2160" : "#7b45ad"} />
          <stop offset="1" stopColor={dark ? "#1d1030" : "#4b2370"} />
        </linearGradient>
        <linearGradient id={`trace-${id}`} x1="40" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={dark ? "#4a2a73" : "#673493"} />
          <stop offset="1" stopColor={dark ? "#1f6e80" : "#26b1ce"} />
        </linearGradient>
        <linearGradient id={`cap-${id}`} x1="300" y1="0" x2="560" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={dark ? "#3a2560" : "#5b3a9a"} />
          <stop offset="1" stopColor={dark ? "#1b7286" : "#26c6e0"} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={dark ? "#673493" : "#c4a5f5"} stopOpacity={dark ? 0.35 : 0.5} />
          <stop offset="1" stopColor={dark ? "#673493" : "#c4a5f5"} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle className="cm__glow" cx="600" cy="350" r="330" fill={`url(#glow-${id})`} />

      <g className="cm__traces">
        {TRACES.map(([x1, y, x2], i) => (
          <g key={i} className="cm__trace">
            <path
              className="cm__line"
              d={`M${x1} ${y} H${x2}`}
              stroke={`url(#trace-${id})`}
              strokeWidth={14}
              strokeLinecap="round"
              pathLength={1}
            />
            <circle className="cm__dot" cx={x1} cy={y} r={22} fill={dark ? "#3d2160" : "#673493"} />
            <circle className="cm__packet" cx={x1} cy={y} r={7} fill={dark ? "#8fe3f3" : "#ffffff"} />
          </g>
        ))}
      </g>

      <g className="cm__diamond">
        <rect
          x="430"
          y="180"
          width="340"
          height="340"
          rx="46"
          transform="rotate(45 600 350)"
          fill={`url(#dia-${id})`}
        />
        <g className="cm__caps">
          <rect className="cm__cap" x="300" y="232" width="260" height="62" rx="31" fill={`url(#cap-${id})`} />
          <rect className="cm__cap" x="300" y="406" width="260" height="62" rx="31" fill={`url(#cap-${id})`} />
        </g>
      </g>
    </svg>
  );
}
