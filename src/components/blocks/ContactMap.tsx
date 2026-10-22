/** Dotted world map with pulsing pins for the regions we work with. */
const pins = [
  { label: "US East", x: 27, y: 38 },
  { label: "US West", x: 15, y: 40 },
  { label: "UK", x: 47.5, y: 27 },
  { label: "Team HQ", x: 69, y: 43 },
];

export function ContactMap() {
  return (
    <div className="map" aria-hidden>
      <div className="map__dots" />
      <svg className="map__arc" viewBox="0 0 100 50" preserveAspectRatio="none">
        {pins.slice(0, 3).map((p) => (
          <path
            key={p.label}
            d={`M69 43 Q ${(69 + p.x) / 2} ${Math.min(p.y, 43) - 18} ${p.x} ${p.y}`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.25"
            strokeDasharray="0.8 0.8"
            opacity="0.7"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {pins.map((p) => (
        <span key={p.label} className="map__pin" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <span>{p.label}</span>
        </span>
      ))}
    </div>
  );
}
