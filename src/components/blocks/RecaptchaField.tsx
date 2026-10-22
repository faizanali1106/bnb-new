"use client";

import { forwardRef, useSyncExternalStore } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

/** Google reCAPTCHA v2 checkbox, themed to match the site. */
export const RecaptchaField = forwardRef<ReCAPTCHA, { onChange: (token: string | null) => void }>(function RecaptchaField(
  { onChange },
  ref,
) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );

  if (!siteKey) {
    return <p className="form__error">Human verification is not configured. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY.</p>;
  }
  return (
    <ReCAPTCHA
      key={dark ? "dark" : "light"}
      ref={ref}
      sitekey={siteKey}
      theme={dark ? "dark" : "light"}
      onChange={onChange}
      onExpired={() => onChange(null)}
    />
  );
});
