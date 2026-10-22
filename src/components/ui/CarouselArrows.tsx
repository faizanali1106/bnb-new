import { ArrowLeft, ArrowRight } from "./icons";

type Props = { canPrev: boolean; canNext: boolean; prev: () => void; next: () => void };

export default function CarouselArrows({ canPrev, canNext, prev, next }: Props) {
  return (
    <div className="car-arrows">
      <button className="car-arrow" onClick={prev} disabled={!canPrev} aria-label="Previous">
        <ArrowLeft />
      </button>
      <button className="car-arrow" onClick={next} disabled={!canNext} aria-label="Next">
        <ArrowRight />
      </button>
    </div>
  );
}
