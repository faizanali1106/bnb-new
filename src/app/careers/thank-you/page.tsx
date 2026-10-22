"use client";

import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Btn from "@/components/ui/Btn";
import SplitText from "@/components/ui/SplitText";

function ThankYouContent() {
  const params = useSearchParams();
  const role = params.get("role");
  const email = params.get("email");
  return (
    <div style={{ maxWidth: "64rem" }}>
      <div className="done__icon">
        <Check />
      </div>
      <SplitText as="h1" className="h2" text="Application *received*" trigger="load" />
      <p className="p-l soft" style={{ margin: "2.5rem auto 3rem", maxWidth: "50rem" }}>
        {role
          ? `Thanks for applying to ${role}. We sent a confirmation${email ? ` to ${email}` : " to your email"} and our HR team has received your application.`
          : "Thanks for applying. We sent a confirmation to your email and our HR team has received your application."}
      </p>
      <div className="btn-row" style={{ justifyContent: "center" }}>
        <Btn href="/careers">Browse more roles</Btn>
        <Btn href="/" variant="ghost">
          Back home
        </Btn>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <section className="done">
      <Suspense fallback={<p className="p-m soft">Loading…</p>}>
        <ThankYouContent />
      </Suspense>
    </section>
  );
}
