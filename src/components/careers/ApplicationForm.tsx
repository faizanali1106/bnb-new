"use client";

import { AlertCircle, CheckCircle, CircleHelp, FileText, Globe, GraduationCap, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import type ReCAPTCHA from "react-google-recaptcha";
import type { Job } from "@/data/jobs";
import { hasParsedValues, parseResumeFile, type ParsedEducation, type ParsedExperience } from "@/lib/parse-resume";
import { sendJobApplicationEmails } from "@/lib/send-job-application";
import { RecaptchaField } from "../blocks/RecaptchaField";
import { ActionBtn } from "../ui/Btn";
import { LinkedIn } from "../ui/icons";

const emptyEducation: ParsedEducation = { school: "", degree: "", year: "" };
const emptyExperience: ParsedExperience = { company: "", role: "", duration: "", description: "" };
const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  website: "",
  coverLetter: "",
  education: [] as ParsedEducation[],
  experience: [] as ParsedExperience[],
};

/** Job application: resume auto-fill, duplicate check, screening questions, reCAPTCHA. */
export function ApplicationForm({ job }: { job: Job }) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isDrag, setIsDrag] = useState(false);
  const [parseNotice, setParseNotice] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const screeningQuestions = job.questions ?? [];

  const updateField = (name: keyof typeof emptyForm, value: string) => setForm((prev) => ({ ...prev, [name]: value }));

  const setEducation = (index: number, patch: Partial<ParsedEducation>) =>
    setForm((prev) => ({ ...prev, education: prev.education.map((e, i) => (i === index ? { ...e, ...patch } : e)) }));
  const setExperience = (index: number, patch: Partial<ParsedExperience>) =>
    setForm((prev) => ({ ...prev, experience: prev.experience.map((e, i) => (i === index ? { ...e, ...patch } : e)) }));

  const handleResume = async (file: File | undefined) => {
    if (!file) return;
    const allowed = [".pdf", ".doc", ".docx", ".txt"];
    if (!allowed.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      setError("Please upload a PDF, DOC, DOCX, or TXT resume.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be 5MB or smaller.");
      return;
    }

    setError(null);
    setResumeFile(file);
    setIsParsing(true);
    setParseNotice(null);
    try {
      const parsed = await parseResumeFile(file);
      setForm((prev) => ({
        ...prev,
        firstName: parsed.firstName || prev.firstName,
        lastName: parsed.lastName || prev.lastName,
        email: parsed.email || prev.email,
        phone: parsed.phone || prev.phone,
        address: parsed.address || prev.address,
        linkedin: parsed.linkedin || prev.linkedin,
        website: parsed.website || prev.website,
        education: parsed.education.length ? parsed.education : prev.education,
        experience: parsed.experience.length ? parsed.experience : prev.experience,
      }));
      setParseNotice(
        hasParsedValues(parsed)
          ? "We filled in what we could from your resume. Please review before submitting."
          : "Resume attached. We could not auto-fill much from this file, so please complete the form manually.",
      );
    } catch {
      setParseNotice("Resume attached. Auto-fill was unavailable for this file, so please complete the form manually.");
    } finally {
      setIsParsing(false);
    }
  };

  const checkExisting = async (email: string) => {
    if (!email || !email.includes("@")) return;
    try {
      const res = await fetch("/api/careers/check-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, jobId: job.id, jobTitle: job.title }),
      });
      const json = (await res.json()) as { alreadyApplied?: boolean; message?: string | null };
      if (json.alreadyApplied && json.message) setError(json.message);
    } catch {
      /* ignore — submit still enforces it */
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }
    if (!captchaToken) {
      setError("Please complete the captcha.");
      return;
    }
    if (screeningQuestions.find((q) => !answers[q.id]?.trim())) {
      setError("Please answer all screening questions for this role.");
      return;
    }

    setIsSubmitting(true);
    try {
      const emailNorm = form.email.trim().toLowerCase();
      const data = new FormData();
      data.append("jobId", job.id);
      data.append("jobTitle", job.title);
      data.append("firstName", form.firstName.trim());
      data.append("lastName", form.lastName.trim());
      data.append("email", emailNorm);
      data.append("phone", form.phone.trim());
      data.append("address", form.address.trim());
      data.append("linkedin", form.linkedin.trim());
      data.append("website", form.website.trim());
      data.append("coverLetter", form.coverLetter.trim());
      data.append("education", JSON.stringify(form.education));
      data.append("experience", JSON.stringify(form.experience));
      data.append(
        "answers",
        JSON.stringify(screeningQuestions.map((q) => ({ questionId: q.id, question: q.prompt, answer: answers[q.id]?.trim() ?? "" }))),
      );
      data.append("resume", resumeFile);
      data.append("captchaToken", captchaToken);

      const res = await fetch("/api/careers/apply", { method: "POST", body: data });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Could not submit application.");

      try {
        await sendJobApplicationEmails({
          jobTitle: job.title,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: emailNorm,
          phone: form.phone.trim(),
          answers: screeningQuestions.map((q) => ({ question: q.prompt, answer: answers[q.id]?.trim() ?? "" })),
        });
      } catch (emailErr) {
        console.error("Application saved, but email failed:", emailErr);
      }

      window.dispatchEvent(
        new CustomEvent("page:leave", {
          detail: `/careers/thank-you?role=${encodeURIComponent(job.title)}&email=${encodeURIComponent(emailNorm)}`,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application. Please try again or email hr@bitandbytes.net.");
      setIsSubmitting(false);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="app-sec">
        <h3 className="h4" style={{ marginBottom: "0.75rem" }}>
          Apply for <span className="serif">{job.title}</span>
        </h3>
        <p className="p-s soft">
          Upload your CV first so we can fill in as much as possible. Your application goes straight to our HR team. Required fields
          are marked with <em className="accent">*</em>.
        </p>
      </div>

      {error ? (
        <div className="form__error" role="alert" style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <AlertCircle size="1.3rem" style={{ flex: "none" }} />
          <span style={{ flex: 1 }}>{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="Dismiss error">
            <X size="1.1rem" />
          </button>
        </div>
      ) : null}

      {parseNotice ? (
        <div className="notice">
          <CheckCircle />
          <p>{parseNotice}</p>
        </div>
      ) : null}

      <div className="field">
        <span className="field__label">
          Resume / CV <em>*</em>
        </span>
        {resumeFile ? (
          <div className="drop" style={{ cursor: "default" }}>
            <span className="drop__icon">
              <FileText />
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="h6" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {resumeFile.name}
              </p>
              <p className="p-xs muted">{(resumeFile.size / 1024).toFixed(0)} KB · HR will receive this file</p>
            </div>
            <button type="button" className="chip chip--sm chip--card" onClick={() => fileInputRef.current?.click()}>
              Replace
            </button>
            <button
              type="button"
              className="repeat__rm"
              style={{ position: "static" }}
              aria-label="Remove resume"
              onClick={() => {
                setResumeFile(null);
                setParseNotice(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <X />
            </button>
          </div>
        ) : (
          <label
            className={`drop${isDrag ? " is-drag" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDrag(true);
            }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDrag(false);
              handleResume(e.dataTransfer.files?.[0]);
            }}
          >
            <span className="drop__icon">{isParsing ? <Loader2 className="spinner" style={{ color: "inherit" }} /> : <Upload />}</span>
            <span>
              <span className="h6" style={{ display: "block" }}>
                {isParsing ? "Reading resume…" : "Drop your CV here or click to upload"}
              </span>
              <span className="p-xs muted">PDF, DOC, DOCX, or TXT. 5MB max.</span>
            </span>
          </label>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,application/pdf"
          style={{ display: "none" }}
          onChange={(e) => handleResume(e.target.files?.[0])}
        />
      </div>

      <div className="form__row">
        <Field id="firstName" label="First name" required>
          <input id="firstName" className="input" required value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Ayesha" />
        </Field>
        <Field id="lastName" label="Last name" required>
          <input id="lastName" className="input" required value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Khan" />
        </Field>
        <Field id="email" label="Email" required>
          <input
            id="email"
            type="email"
            className="input"
            required
            value={form.email}
            onChange={(e) => {
              updateField("email", e.target.value);
              if (error?.includes("already applied")) setError(null);
            }}
            onBlur={(e) => checkExisting(e.target.value.trim())}
            placeholder="you@email.com"
          />
        </Field>
        <Field id="phone" label="Phone" required>
          <input id="phone" type="tel" className="input" required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+92 300 1234567" />
        </Field>
      </div>

      <Field id="address" label="Address" required>
        <textarea id="address" className="input" required rows={3} value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Street, city, country" />
      </Field>

      <div className="form__row">
        <Field id="linkedin" label={<><LinkedIn width="1em" height="1em" className="accent" style={{ display: "inline", marginRight: "0.4rem" }} />LinkedIn</>}>
          <input id="linkedin" type="url" className="input" value={form.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} placeholder="https://linkedin.com/in/your-profile" />
        </Field>
        <Field id="website" label={<><Globe size="1em" className="accent" style={{ display: "inline", marginRight: "0.4rem" }} />Portfolio / website</>}>
          <input id="website" type="url" className="input" value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://your-site.com" />
        </Field>
      </div>

      <Field id="coverLetter" label="Cover letter">
        <textarea id="coverLetter" className="input" rows={5} value={form.coverLetter} onChange={(e) => updateField("coverLetter", e.target.value)} placeholder="Why are you a good fit for this role?" />
      </Field>

      <div className="app-sec">
        <div className="app-sec__h">
          <h4 className="h5" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <GraduationCap className="accent" /> Profile
          </h4>
          <span className="label">Optional</span>
        </div>
        <p className="p-s soft" style={{ marginBottom: "1.5rem" }}>
          Add education and experience if you want the team to see more than your resume.
        </p>

        <div className="app-sec__h">
          <span className="h6">Education</span>
          <button type="button" className="chip chip--sm" onClick={() => setForm((p) => ({ ...p, education: [...p.education, { ...emptyEducation }] }))}>
            <Plus size="1em" /> Add education
          </button>
        </div>
        {form.education.length === 0 ? <p className="p-s muted" style={{ marginBottom: "1.5rem" }}>No education added.</p> : null}
        {form.education.map((entry, index) => (
          <div className="repeat" key={`education-${index}`} style={{ marginBottom: "1rem" }}>
            <RemoveBtn label="Remove education" onClick={() => setForm((p) => ({ ...p, education: p.education.filter((_, i) => i !== index) }))} />
            <div className="form__row" style={{ paddingRight: "3rem" }}>
              <input className="input" placeholder="School or university" value={entry.school} onChange={(e) => setEducation(index, { school: e.target.value })} />
              <input className="input" placeholder="Degree" value={entry.degree} onChange={(e) => setEducation(index, { degree: e.target.value })} />
              <input className="input" placeholder="Year" value={entry.year} onChange={(e) => setEducation(index, { year: e.target.value })} />
            </div>
          </div>
        ))}

        <div className="app-sec__h" style={{ marginTop: "1.5rem" }}>
          <span className="h6">Experience</span>
          <button type="button" className="chip chip--sm" onClick={() => setForm((p) => ({ ...p, experience: [...p.experience, { ...emptyExperience }] }))}>
            <Plus size="1em" /> Add experience
          </button>
        </div>
        {form.experience.length === 0 ? <p className="p-s muted">No experience added.</p> : null}
        {form.experience.map((entry, index) => (
          <div className="repeat" key={`experience-${index}`} style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
            <RemoveBtn label="Remove experience" onClick={() => setForm((p) => ({ ...p, experience: p.experience.filter((_, i) => i !== index) }))} />
            <div className="form__row" style={{ paddingRight: "3rem" }}>
              <input className="input" placeholder="Company" value={entry.company} onChange={(e) => setExperience(index, { company: e.target.value })} />
              <input className="input" placeholder="Role" value={entry.role} onChange={(e) => setExperience(index, { role: e.target.value })} />
            </div>
            <input className="input" placeholder="Duration, e.g. 2022 to present" value={entry.duration} onChange={(e) => setExperience(index, { duration: e.target.value })} />
            <textarea className="input" rows={3} placeholder="What did you work on?" value={entry.description} onChange={(e) => setExperience(index, { description: e.target.value })} />
          </div>
        ))}
      </div>

      {screeningQuestions.length ? (
        <div className="app-sec">
          <h4 className="h5" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <CircleHelp className="accent" /> Screening questions
          </h4>
          <p className="p-s soft" style={{ margin: "0.5rem 0 1.5rem" }}>
            These questions are specific to this role and required.
          </p>
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {screeningQuestions.map((q, index) => (
              <Field key={q.id} id={`screening-${q.id}`} label={`${index + 1}. ${q.prompt}`} required>
                <textarea
                  id={`screening-${q.id}`}
                  className="input"
                  required
                  rows={3}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Your answer"
                />
              </Field>
            ))}
          </div>
        </div>
      ) : null}

      <div className="app-sec" style={{ display: "grid", gap: "1.5rem" }}>
        <RecaptchaField ref={recaptchaRef} onChange={setCaptchaToken} />
        <ActionBtn type="submit" className="btn--block" disabled={isSubmitting || !captchaToken}>
          {isSubmitting ? "Submitting application…" : "Submit application"}
        </ActionBtn>
      </div>
    </form>
  );
}

function Field({ id, label, required, children }: { id: string; label: React.ReactNode; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label} {required ? <em>*</em> : null}
      </label>
      {children}
    </div>
  );
}

function RemoveBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="repeat__rm" aria-label={label} onClick={onClick}>
      <Trash2 />
    </button>
  );
}
