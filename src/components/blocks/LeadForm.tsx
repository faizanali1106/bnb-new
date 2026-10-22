"use client";

import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import type ReCAPTCHA from "react-google-recaptcha";
import { contactInfo, leadNeeds } from "@/data/site";
import { assertCaptcha } from "@/lib/assert-captcha";
import { notifySlack } from "@/lib/send-slack-notification";
import Btn, { ActionBtn } from "../ui/Btn";
import { RecaptchaField } from "./RecaptchaField";

const empty = { name: "", email: "", company: "", need: "", message: "", nda: false };

/** Enquiry form: sends via EmailJS, pings Slack, guarded by reCAPTCHA. */
export function LeadForm({
  title = "Tell us what you need",
  sub,
  source,
  defaultNeed,
}: {
  title?: string;
  sub?: string;
  /** Page the enquiry came from, included in the email subject. */
  source: string;
  defaultNeed?: string;
}) {
  const [form, setForm] = useState({ ...empty, need: defaultNeed ?? "" });
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const set = (key: keyof typeof empty, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.need) {
      setError("Please choose what you need.");
      return;
    }
    setStatus("sending");
    try {
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      if (!publicKey || !serviceId || !templateId) {
        throw new Error(`Email service is not configured. Please email ${contactInfo.email}.`);
      }
      await assertCaptcha(captcha);

      const subject = `[Lead · ${source}] ${form.need}`;
      const message = [
        `Company: ${form.company.trim()}`,
        `Need: ${form.need}`,
        `NDA requested: ${form.nda ? "Yes" : "No"}`,
        `Source page: ${source}`,
        "",
        form.message.trim() || "(no message)",
      ].join("\n");

      emailjs.init({ publicKey });
      const result = await emailjs.send(serviceId, templateId, {
        name: form.name.trim(),
        email: form.email.trim(),
        title: subject,
        subject,
        message,
        to_email: contactInfo.email,
      });
      if (result.status !== 200) throw new Error("Failed to send. Please try again.");

      void notifySlack({ type: "contact", name: form.name.trim(), email: form.email.trim(), subject, message });
      setStatus("sent");
      setForm({ ...empty });
      setCaptcha(null);
      recaptchaRef.current?.reset();
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    }
  };

  if (status === "sent") {
    return (
      <div className="form-card fade-swap">
        <div className="form-done__icon">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M2 6.5 4.8 9 10 3" />
          </svg>
        </div>
        <h3 className="h4 form-card__h">Thanks, we&apos;ve got it</h3>
        <p className="p-m form-card__sub">{contactInfo.responseTime} A senior engineer will read your note and reply with next steps.</p>
        <Btn href="/work" variant="tile">
          See our work while you wait
        </Btn>
      </div>
    );
  }

  return (
    <form className="form-card form" onSubmit={onSubmit}>
      <div>
        <h3 className="h5 form-card__h">{title}</h3>
        {sub ? <p className="p-s soft">{sub}</p> : null}
      </div>

      <div className="form__row">
        <label className="field">
          <span className="field__label">Full name</span>
          <input className="input" required placeholder="Jane Cooper" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">Work email</span>
          <input
            className="input"
            required
            type="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </label>
      </div>
      <label className="field">
        <span className="field__label">Company</span>
        <input className="input" required placeholder="Company name" value={form.company} onChange={(e) => set("company", e.target.value)} />
      </label>

      <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="field__label" style={{ marginBottom: "0.6rem" }}>
          What do you need?
        </legend>
        <div className="chips">
          {leadNeeds.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={form.need === n}
              className={`chip chip--sm${form.need === n ? " is-active" : ""}`}
              onClick={() => set("need", n)}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span className="field__label">Message (optional)</span>
        <textarea
          className="input"
          rows={4}
          placeholder="Type your message here"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </label>

      <label className="check-field">
        <input type="checkbox" checked={form.nda} onChange={(e) => set("nda", e.target.checked)} />
        Request an NDA before we talk
      </label>

      <RecaptchaField ref={recaptchaRef} onChange={setCaptcha} />

      {error ? <p className="form__error">{error}</p> : null}

      <div className="form__foot">
        <ActionBtn type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Submit"}
        </ActionBtn>
        <p className="p-xs muted">{contactInfo.responseTime}</p>
      </div>
    </form>
  );
}
