import { BitMark } from "./icons";

export default function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`eyebrow ${className}`}>
      <BitMark className="eyebrow__mark" />
      <span>{children}</span>
    </div>
  );
}
