import Btn from "@/components/ui/Btn";
import Eyebrow from "@/components/ui/Eyebrow";
import SplitText from "@/components/ui/SplitText";

export default function NotFound() {
  return (
    <section className="done">
      <div>
        <Eyebrow>404</Eyebrow>
        <SplitText as="h1" className="h2" text="This page took a *wrong turn*" trigger="load" />
        <p className="p-l soft" style={{ margin: "2.5rem auto 3rem", maxWidth: "46rem" }}>
          The link may be old or the page has moved. Here are a few good places to start instead.
        </p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Btn href="/">Back home</Btn>
          <Btn href="/services" variant="white">
            Services
          </Btn>
          <Btn href="/work" variant="ghost">
            Our work
          </Btn>
        </div>
      </div>
    </section>
  );
}
